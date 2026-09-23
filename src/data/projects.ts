export type Project = {
  tag: string
  title: string
  text: string
  tone?: 'blue' | 'orange'
}

// Conteúdo fixo das páginas de projetos. As listas começam vazias até que
// os projetos reais sejam cadastrados aqui.

export const projetosPesquisa: Project[] = []

export const pic: Project[] = []

export const mac: Project[] = []

export const ligasAcademicas: Project[] = []
