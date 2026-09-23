import { upload } from '@vercel/blob/client'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { DEFAULT_HIGHLIGHTS, SECTIONS, type Section } from '../../shared/sections'
import type { Post } from '../data/academicPosts'
import { auth, db } from './firebase'

export type { Section }

export const SECTION_LABELS: Record<Section, string> = {
  noticias: 'Notícias',
  editais: 'Editais',
  regimentos: 'Regimentos',
  formularios: 'Formulários',
  revista: 'Revista Científica',
  medicinaEvidencia: 'Medicina Baseada em Evidência',
  graduacao: 'Graduação',
  residencias: 'Residências',
  monitoria: 'Monitoria',
  picv: 'PICV',
  gruposPesquisa: 'Grupos de Pesquisa (GTES)',
  tccTcr: 'TCC / TCR',
  cep: 'CEP — Comitê de Ética em Pesquisa',
  projetoIntegrador: 'Projeto Integrador / MOPI',
  projetosExtensao: 'Projetos de Extensão',
  cursosExtensao: 'Cursos de Extensão',
  atividadesExtensao: 'Atividades de Extensão',
  sucupira: 'Sucupira',
  fundacoesAssociacoes: 'Fundações / Associações',
}

// --- Autenticação (Firebase Auth) ---

export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

export async function login(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch {
    throw new Error('E-mail ou senha incorretos.')
  }
}

export async function logout(): Promise<void> {
  await signOut(auth)
}

async function getIdToken(): Promise<string> {
  const user = auth.currentUser
  if (!user) throw new Error('Sessão expirada. Faça login novamente.')
  return user.getIdToken()
}

async function authorizedFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await getIdToken()
  return fetch(url, {
    ...init,
    headers: { ...(init.headers as Record<string, string> | undefined), Authorization: `Bearer ${token}` },
  })
}

/** Sobe o arquivo direto pro Vercel Blob (não passa pelo body das serverless functions). */
async function uploadFile(file: File): Promise<string> {
  const token = await getIdToken()
  const blob = await upload(file.name, file, {
    access: 'public',
    handleUploadUrl: `/api/blob/upload?token=${encodeURIComponent(token)}`,
  })
  return blob.url
}

// --- Publicações (Firestore) ---

function docToPost(docSnap: QueryDocumentSnapshot<DocumentData>): Post {
  const data = docSnap.data()
  return {
    id: docSnap.id,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt ?? undefined,
    fileUrl: data.fileUrl ?? undefined,
    createdAt: data.createdAt,
  }
}

export async function fetchPosts(section: Section): Promise<Post[]> {
  const snap = await getDocs(query(collection(db, section), orderBy('createdAt', 'desc')))
  return snap.docs.map(docToPost)
}

export async function createPost(
  section: Section,
  fields: { title: string; date?: string; excerpt?: string; file?: File | null },
): Promise<Post> {
  const fileUrl = fields.file ? await uploadFile(fields.file) : undefined
  const res = await authorizedFetch(`/api/posts/${section}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: fields.title, date: fields.date, excerpt: fields.excerpt, fileUrl }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Falha ao publicar.')
  return data
}

export async function updatePost(
  section: Section,
  id: string,
  fields: { title: string; date?: string; excerpt?: string; file?: File | null },
): Promise<Post> {
  const body: Record<string, unknown> = {
    title: fields.title,
    date: fields.date,
    excerpt: fields.excerpt,
  }
  if (fields.file) {
    body.fileUrl = await uploadFile(fields.file)
  }
  const res = await authorizedFetch(`/api/posts/${section}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Falha ao salvar as alterações.')
  return data
}

export async function deletePost(section: Section, id: string): Promise<void> {
  const res = await authorizedFetch(`/api/posts/${section}/${id}`, { method: 'DELETE' })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || 'Falha ao excluir.')
  }
}

// --- Destaques da home (Firestore) ---

export async function fetchHighlights(): Promise<string[]> {
  const snap = await getDoc(doc(db, 'settings', 'highlights'))
  const keys = snap.data()?.keys
  return Array.isArray(keys) && keys.length === 4 ? keys : DEFAULT_HIGHLIGHTS
}

export async function saveHighlights(keys: string[]): Promise<string[]> {
  const res = await authorizedFetch('/api/highlights', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ keys }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Falha ao salvar destaques.')
  return data
}

/** Destaques escolhidos no painel; usa o padrão se o Firestore estiver fora do ar. */
export function useHighlights(): string[] {
  const [keys, setKeys] = useState<string[]>(DEFAULT_HIGHLIGHTS)

  useEffect(() => {
    let active = true
    fetchHighlights()
      .then((remote) => {
        if (active) setKeys(remote)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return keys
}

/**
 * Mural geral: junta as publicações de todas as seções do site (Ensino,
 * Pesquisa, Extensão, Institucional…), mais recentes primeiro. Usado pela
 * página Notícias — qualquer publicação, de qualquer área, aparece ali.
 */
export function useAllPosts(): Post[] {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    let active = true
    Promise.all(
      SECTIONS.map((section) =>
        fetchPosts(section)
          .then((list) => list.map((post) => ({ ...post, sectionLabel: SECTION_LABELS[section] })))
          .catch(() => [] as Post[]),
      ),
    ).then((lists) => {
      if (!active) return
      const merged = lists.flat().sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return timeB - timeA
      })
      setPosts(merged)
    })
    return () => {
      active = false
    }
  }, [])

  return posts
}

/**
 * Publicações do painel mescladas na frente do conteúdo fixo do site.
 * Se o Firestore estiver fora do ar, o site continua mostrando o conteúdo fixo.
 */
export function usePosts(section: Section, fallback: Post[]): Post[] {
  const [posts, setPosts] = useState<Post[]>(fallback)

  useEffect(() => {
    let active = true
    fetchPosts(section)
      .then((remote) => {
        if (active) setPosts([...remote, ...fallback])
      })
      .catch(() => {})
    return () => {
      active = false
    }
    // fallback é constante (importado de data/), não precisa re-disparar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section])

  return posts
}
