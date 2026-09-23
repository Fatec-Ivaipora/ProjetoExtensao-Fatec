export type Post = {
  id?: string
  title: string
  date: string
  excerpt?: string
  fileUrl?: string
  createdAt?: string
  sectionLabel?: string
}

// Conteúdo fixo de cada seção. As listas começam vazias: tudo é publicado
// pelo painel admin (/admin). Itens adicionados aqui aparecem depois dos
// publicados pelo painel.

export const editais: Post[] = []

export const noticias: Post[] = []

export const revista: Post[] = []

export const regimentos: Post[] = []

export const medicinaEvidencia: Post[] = []

export const formularios: Post[] = []

export const graduacao: Post[] = []

export const residencias: Post[] = []

export const monitoria: Post[] = []

export const picv: Post[] = []

export const gruposPesquisa: Post[] = []

export const tccTcr: Post[] = []

export const cep: Post[] = []

export const projetoIntegrador: Post[] = []

export const projetosExtensao: Post[] = []

export const cursosExtensao: Post[] = []

export const atividadesExtensao: Post[] = []

export const sucupira: Post[] = []

export const fundacoesAssociacoes: Post[] = []
