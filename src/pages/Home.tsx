import { Link } from 'react-router-dom'
import HeroVideo from '../components/HeroVideo'
import InfoBoard from '../components/InfoBoard'
import Reveal from '../components/Reveal'
import { HIGHLIGHT_TOPICS } from '../data/highlights'
import { useHighlights } from '../lib/api'
import './Home.css'

export default function Home() {
  const highlightKeys = useHighlights()
  const highlights = highlightKeys
    .map((key) => HIGHLIGHT_TOPICS.find((topic) => topic.key === key))
    .filter((topic) => topic !== undefined)

  return (
    <>
      <section className="hero">
        <HeroVideo />
        <div className="container hero-inner">
          <span className="eyebrow">Fatec Ivaiporã</span>
          <h1>Pesquisa e Extensão em Medicina</h1>
          <p className="hero-lead">
            Projetos de pesquisa, iniciação científica e extensão desenvolvidos por
            docentes e estudantes da área da saúde.
          </p>
          <div className="hero-actions">
            <Link to="/projetos-pesquisa" className="btn btn-primary">Ver projetos de pesquisa</Link>
            <Link to="/ligas-academicas" className="btn btn-outline">Conhecer ligas acadêmicas</Link>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Áreas em destaque</h2>

          <div className="program-grid">
            {highlights.map((item, index) => (
              <Reveal delay={index * 80} key={item.key}>
                <Link to={item.to} className={`program-card card tone-${index % 2 === 0 ? 'blue' : 'orange'}`}>
                  <span className="program-area">{item.area}</span>
                  <h3>{item.title}</h3>
                  <span className="program-cta">
                    Acessar <span className="program-arrow">&rarr;</span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <InfoBoard />
    </>
  )
}
