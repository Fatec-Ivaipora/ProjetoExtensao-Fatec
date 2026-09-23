import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { User } from 'firebase/auth'
import { Link } from 'react-router-dom'
import logoFatec from '../../assets/logo-fatec.png'
import type { Post } from '../../data/academicPosts'
import { HIGHLIGHT_TOPICS } from '../../data/highlights'
import {
  SECTION_LABELS,
  createPost,
  deletePost,
  fetchHighlights,
  fetchPosts,
  login,
  logout,
  onAuthChange,
  saveHighlights,
  updatePost,
} from '../../lib/api'
import type { Section } from '../../lib/api'
import './Admin.css'

const SECTIONS = Object.keys(SECTION_LABELS) as Section[]

export default function Admin() {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => onAuthChange(setUser), [])

  if (user === undefined) {
    return <div className="admin-login">Carregando…</div>
  }

  return user ? <AdminPanel /> : <AdminLogin />
}

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha no login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card card" onSubmit={handleSubmit}>
        <img src={logoFatec} alt="Fatec Ivaiporã" className="admin-logo" />
        <h1>Área administrativa</h1>
        <p>Entre com seu e-mail e senha para publicar notícias, editais e documentos.</p>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoFocus
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {error && <span className="admin-error">{error}</span>}
        <button className="btn btn-primary" type="submit" disabled={loading || !email || !password}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
        <Link to="/" className="admin-back">
          ← Voltar ao site
        </Link>
      </form>
    </div>
  )
}

function AdminPanel() {
  const [view, setView] = useState<'posts' | 'highlights'>('posts')
  const [section, setSection] = useState<Section>('noticias')
  const [posts, setPosts] = useState<Post[]>([])
  const [editing, setEditing] = useState<Post | null>(null)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [fileKey, setFileKey] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPosts(section)
      .then(setPosts)
      .catch(() => setPosts([]))
  }, [section])

  function clearForm() {
    setEditing(null)
    setTitle('')
    setDate('')
    setExcerpt('')
    setFile(null)
    setFileKey((k) => k + 1)
  }

  function changeSection(s: Section) {
    setView('posts')
    setSection(s)
    setMessage('')
    setError('')
    clearForm()
  }

  function startEdit(post: Post) {
    setEditing(post)
    setTitle(post.title)
    setDate(post.date)
    setExcerpt(post.excerpt ?? '')
    setFile(null)
    setFileKey((k) => k + 1)
    setMessage('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleLogout() {
    logout()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)
    try {
      if (editing?.id) {
        const post = await updatePost(section, editing.id, { title, date, excerpt, file })
        setPosts((prev) => prev.map((p) => (p.id === post.id ? post : p)))
        setMessage('Alterações salvas com sucesso!')
      } else {
        const post = await createPost(section, { title, date, excerpt, file })
        setPosts((prev) => [post, ...prev])
        setMessage('Publicado com sucesso!')
      }
      clearForm()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar.'
      setError(msg)
      if (msg.includes('login')) handleLogout()
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Excluir esta publicação?')) return
    setError('')
    try {
      await deletePost(section, id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
      if (editing?.id === id) clearForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir.')
    }
  }

  return (
    <div className="admin">
      <header className="admin-header">
        <div className="admin-header-inner">
          <img src={logoFatec} alt="Fatec Ivaiporã" className="admin-logo-small" />
          <span className="admin-title">Painel de publicações</span>
          <nav className="admin-header-actions">
            <Link to="/" className="admin-link">
              Ver site
            </Link>
            <button className="admin-link admin-logout" onClick={handleLogout}>
              Sair
            </button>
          </nav>
        </div>
      </header>

      <div className="admin-body">
        <aside className="admin-sections">
          {SECTIONS.map((s) => (
            <button
              key={s}
              className={
                view === 'posts' && s === section ? 'admin-section-btn active' : 'admin-section-btn'
              }
              onClick={() => changeSection(s)}
            >
              {SECTION_LABELS[s]}
            </button>
          ))}
          <hr className="admin-sections-divider" />
          <button
            className={view === 'highlights' ? 'admin-section-btn active' : 'admin-section-btn'}
            onClick={() => setView('highlights')}
          >
            ⭐ Destaques da Home
          </button>
        </aside>

        <main className="admin-main">
          {view === 'highlights' && <HighlightsManager onAuthError={handleLogout} />}
          {view === 'posts' && (
          <>
          <form className="admin-form card" onSubmit={handleSubmit}>
            <h2>
              {editing
                ? `Editando publicação em ${SECTION_LABELS[section]}`
                : `Nova publicação em ${SECTION_LABELS[section]}`}
            </h2>
            {editing && (
              <p className="admin-editing-note">
                Você está editando “{editing.title}”. Salve as alterações ou cancele para voltar a
                criar uma nova publicação.
              </p>
            )}
            <label>
              Título *
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex.: Edital nº 06/2026 — Seleção de bolsistas"
                required
              />
            </label>
            <label>
              Data / rótulo
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Deixe em branco para usar a data de hoje (ou escreva “PDF”, um nome de autor…)"
              />
            </label>
            <label>
              Descrição
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                placeholder="Resumo curto exibido abaixo do título"
              />
            </label>
            <label>
              Arquivo (opcional — PDF, DOC…)
              <input
                key={fileKey}
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {editing?.fileUrl && (
                <span className="admin-file-note">
                  Arquivo atual:{' '}
                  <a href={editing.fileUrl} target="_blank" rel="noreferrer">
                    abrir 📎
                  </a>{' '}
                  — envie um novo arquivo apenas se quiser substituí-lo.
                </span>
              )}
            </label>
            {error && <span className="admin-error">{error}</span>}
            {message && <span className="admin-success">{message}</span>}
            <div className="admin-form-actions">
              <button className="btn btn-primary" type="submit" disabled={loading || !title.trim()}>
                {loading ? 'Salvando…' : editing ? 'Salvar alterações' : 'Publicar'}
              </button>
              {editing && (
                <button type="button" className="admin-cancel" onClick={clearForm}>
                  Cancelar edição
                </button>
              )}
            </div>
          </form>

          <section className="admin-list">
            <h2>Publicações no site — {SECTION_LABELS[section]}</h2>
            {posts.length === 0 && (
              <p className="admin-empty">
                Nada publicado pelo painel ainda nesta seção. O conteúdo fixo do site continua
                aparecendo normalmente.
              </p>
            )}
            {posts.map((post) => (
              <article key={post.id} className="admin-post card">
                <div>
                  <span className="admin-post-date">{post.date}</span>
                  <h3>
                    {post.fileUrl ? (
                      <a href={post.fileUrl} target="_blank" rel="noreferrer">
                        {post.title} 📎
                      </a>
                    ) : (
                      post.title
                    )}
                  </h3>
                  {post.excerpt && <p>{post.excerpt}</p>}
                </div>
                <div className="admin-post-actions">
                  <button
                    className="admin-edit"
                    onClick={() => startEdit(post)}
                    title="Editar publicação"
                  >
                    Editar
                  </button>
                  <button
                    className="admin-delete"
                    onClick={() => post.id && handleDelete(post.id)}
                    title="Excluir publicação"
                  >
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </section>
          </>
          )}
        </main>
      </div>
    </div>
  )
}

function HighlightsManager({ onAuthError }: { onAuthError: () => void }) {
  const [selected, setSelected] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchHighlights()
      .then(setSelected)
      .catch(() => setError('Não foi possível carregar os destaques atuais.'))
  }, [])

  function toggle(key: string) {
    setMessage('')
    setError('')
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key)
      if (prev.length >= 4) {
        setError('Já há 4 destaques escolhidos — desmarque um antes de adicionar outro.')
        return prev
      }
      return [...prev, key]
    })
  }

  async function handleSave() {
    setMessage('')
    setError('')
    setLoading(true)
    try {
      await saveHighlights(selected)
      setMessage('Destaques salvos! A página inicial já está atualizada.')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao salvar destaques.'
      setError(msg)
      if (msg.includes('login')) onAuthError()
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="admin-form card admin-highlights">
      <h2>Destaques da página inicial</h2>
      <p className="admin-highlights-help">
        Escolha exatamente <strong>4 tópicos</strong> para a seção “Áreas em destaque”. A ordem da
        escolha (1º ao 4º) é a ordem em que aparecem no site.
      </p>

      <div className="admin-highlights-grid">
        {HIGHLIGHT_TOPICS.map((topic) => {
          const position = selected.indexOf(topic.key)
          const isSelected = position !== -1
          return (
            <button
              type="button"
              key={topic.key}
              className={isSelected ? 'admin-topic selected' : 'admin-topic'}
              onClick={() => toggle(topic.key)}
            >
              <span className="admin-topic-order">{isSelected ? `${position + 1}º` : '—'}</span>
              <span className="admin-topic-info">
                <span className="admin-topic-area">{topic.area}</span>
                <span className="admin-topic-title">{topic.title}</span>
              </span>
            </button>
          )
        })}
      </div>

      {error && <span className="admin-error">{error}</span>}
      {message && <span className="admin-success">{message}</span>}

      <div className="admin-form-actions">
        <button
          className="btn btn-primary"
          type="button"
          onClick={handleSave}
          disabled={loading || selected.length !== 4}
        >
          {loading ? 'Salvando…' : 'Salvar destaques'}
        </button>
        <span className="admin-highlights-count">{selected.length} de 4 escolhidos</span>
      </div>
    </section>
  )
}
