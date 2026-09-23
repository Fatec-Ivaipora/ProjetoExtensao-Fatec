export type HighlightTopic = {
  key: string
  area: string
  title: string
  to: string
}

// Tópicos que podem ser escolhidos como destaque na página inicial.
export const HIGHLIGHT_TOPICS: HighlightTopic[] = [
  { key: 'projetos-pesquisa', area: 'Pesquisa', title: 'Projetos de Pesquisa', to: '/projetos-pesquisa' },
  { key: 'ligas-academicas', area: 'Extensão', title: 'Ligas Acadêmicas', to: '/ligas-academicas' },
  { key: 'pic', area: 'Iniciação Científica', title: 'Projetos de Iniciação Científica (PIC)', to: '/pic' },
  { key: 'mac', area: 'Evento anual', title: 'Mostra de Iniciação Científica (MAC)', to: '/mac' },
  { key: 'noticias', area: 'Publicações', title: 'Notícias', to: '/noticias' },
  { key: 'editais', area: 'Publicações', title: 'Editais', to: '/editais' },
  { key: 'revista-cientifica', area: 'Publicações', title: 'Revista Científica (REFI)', to: '/revista-cientifica' },
  { key: 'medicina-baseada-evidencia', area: 'Pesquisa e Extensão', title: 'Medicina Baseada em Evidência', to: '/medicina-baseada-evidencia' },
  { key: 'regimentos', area: 'Documentos', title: 'Regimentos', to: '/regimentos' },
  { key: 'formularios', area: 'Documentos', title: 'Formulários', to: '/formularios' },
]

export { DEFAULT_HIGHLIGHTS as DEFAULT_HIGHLIGHT_KEYS } from '../../shared/sections'
