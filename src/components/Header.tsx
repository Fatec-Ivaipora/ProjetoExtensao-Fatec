import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo-fatec.png'
import './Header.css'

type NavEntry =
  | { type: 'link'; to: string; label: string; end?: boolean }
  | { type: 'group'; key: string; label: string; items: { to: string; label: string }[] }

const navEntries: NavEntry[] = [
  { type: 'link', to: '/', label: 'Início', end: true },
  {
    type: 'group',
    key: 'ensino',
    label: 'Ensino',
    items: [
      { to: '/graduacao', label: 'Graduação' },
      { to: '/ligas-academicas', label: 'Ligas Acadêmicas' },
      { to: '/residencias', label: 'Residências' },
      { to: '/monitoria', label: 'Monitoria' },
    ],
  },
  {
    type: 'group',
    key: 'pesquisa',
    label: 'Pesquisa',
    items: [
      { to: '/tcc-tcr', label: 'TCC / TCR' },
      { to: '/projetos-pesquisa', label: 'Projetos de Pesquisa' },
      { to: '/grupos-pesquisa', label: 'Grupos de Pesquisa (GTES)' },
      { to: '/mac', label: 'Mostra de Iniciação Científica (MAC)' },
      { to: '/pic', label: 'Projetos de Iniciação Científica (PIC)' },
      { to: '/picv', label: 'Projetos de Iniciação Científica Voluntária (PICV)' },
    ],
  },
  {
    type: 'group',
    key: 'extensao',
    label: 'Extensão',
    items: [
      { to: '/projeto-integrador-mopi', label: 'Projeto Integrador / MOPI' },
      { to: '/projetos-extensao', label: 'Projetos de Extensão' },
      { to: '/cursos-extensao', label: 'Cursos de Extensão' },
      { to: '/atividades-extensao', label: 'Atividades de Extensão' },
    ],
  },
  { type: 'link', to: '/revista-cientifica', label: 'Revista Científica (REFI)' },
  { type: 'link', to: '/formularios', label: 'Formulários' },
  { type: 'link', to: '/fundacoes-associacoes', label: 'Fundações / Associações' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<string>('root')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function closeAll() {
    setOpen(false)
    setOpenGroup(null)
    setMobileView('root')
  }

  function toggleDrawer() {
    setOpen((v) => {
      const next = !v
      if (!next) setMobileView('root')
      return next
    })
  }

  const activeMobileGroup = navEntries.find(
    (entry): entry is Extract<NavEntry, { type: 'group' }> => entry.type === 'group' && entry.key === mobileView,
  )

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <NavLink to="/" className="brand" onClick={closeAll}>
          <img src={logo} alt="Fatec Ivaiporã" className="brand-logo" />
          <span className="brand-text">
            Pesquisa e Extensão
            <small>Fatec Ivaiporã</small>
          </span>
        </NavLink>

        <button
          className={`menu-toggle ${open ? 'is-open' : ''}`}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={toggleDrawer}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className="nav-desktop">
          <ul>
            {navEntries.map((entry) => {
              if (entry.type === 'link') {
                return (
                  <li key={entry.to}>
                    <NavLink
                      to={entry.to}
                      end={entry.end}
                      className={({ isActive }) => (isActive ? 'active' : '')}
                    >
                      {entry.label}
                    </NavLink>
                  </li>
                )
              }

              return (
                <li className="has-dropdown" key={entry.key}>
                  <button
                    type="button"
                    className="dropdown-trigger"
                    aria-expanded={openGroup === entry.key}
                    onClick={() => setOpenGroup((v) => (v === entry.key ? null : entry.key))}
                  >
                    {entry.label}
                    <span className="chevron chevron-down" aria-hidden="true"></span>
                  </button>

                  <ul className={`dropdown-menu ${openGroup === entry.key ? 'is-open' : ''}`}>
                    {entry.items.map((link) => (
                      <li key={link.to}>
                        <NavLink
                          to={link.to}
                          className={({ isActive }) => (isActive ? 'active' : '')}
                          onClick={() => setOpenGroup(null)}
                        >
                          {link.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </nav>

        <a
          href="https://fatecivaipora.com.br"
          target="_blank"
          rel="noreferrer"
          className="site-btn"
        >
          Site da Fatec <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className={`drawer-overlay ${open ? 'is-open' : ''}`} onClick={closeAll}></div>

      <nav className={`drawer ${open ? 'is-open' : ''}`}>
        {mobileView === 'root' && (
          <ul className="drawer-list">
            {navEntries.map((entry) => {
              if (entry.type === 'link') {
                return (
                  <li key={entry.to}>
                    <NavLink
                      to={entry.to}
                      end={entry.end}
                      className={({ isActive }) => (isActive ? 'active' : '')}
                      onClick={closeAll}
                    >
                      {entry.label}
                    </NavLink>
                  </li>
                )
              }

              return (
                <li key={entry.key}>
                  <button type="button" className="drawer-item" onClick={() => setMobileView(entry.key)}>
                    {entry.label}
                    <span className="chevron chevron-right" aria-hidden="true"></span>
                  </button>
                </li>
              )
            })}
            <li>
              <a
                href="https://fatecivaipora.com.br"
                target="_blank"
                rel="noreferrer"
                className="drawer-site-btn"
                onClick={closeAll}
              >
                Site da Fatec <span aria-hidden="true">↗</span>
              </a>
            </li>
          </ul>
        )}

        {activeMobileGroup && (
          <ul className="drawer-list">
            <li>
              <button type="button" className="drawer-back" onClick={() => setMobileView('root')}>
                <span className="chevron chevron-left" aria-hidden="true"></span>
                {activeMobileGroup.label}
              </button>
            </li>

            {activeMobileGroup.items.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeAll}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  )
}
