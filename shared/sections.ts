// Lista única de seções e destaques válidos, compartilhada entre o client (src/)
// e as serverless functions (api/) — evita duplicar/desalinhar as duas listas.

export const SECTIONS = [
  'noticias',
  'editais',
  'regimentos',
  'formularios',
  'revista',
  'medicinaEvidencia',
  'graduacao',
  'residencias',
  'monitoria',
  'picv',
  'gruposPesquisa',
  'tccTcr',
  'cep',
  'projetoIntegrador',
  'projetosExtensao',
  'cursosExtensao',
  'atividadesExtensao',
  'sucupira',
  'fundacoesAssociacoes',
] as const

export type Section = (typeof SECTIONS)[number]

export function isSection(value: string): value is Section {
  return (SECTIONS as readonly string[]).includes(value)
}

// Mesma lista de chaves usada em src/data/highlights.ts (HIGHLIGHT_TOPICS).
export const HIGHLIGHT_KEYS = [
  'projetos-pesquisa',
  'ligas-academicas',
  'pic',
  'mac',
  'noticias',
  'editais',
  'revista-cientifica',
  'medicina-baseada-evidencia',
  'regimentos',
  'formularios',
] as const

export const DEFAULT_HIGHLIGHTS = ['projetos-pesquisa', 'ligas-academicas', 'pic', 'mac']
