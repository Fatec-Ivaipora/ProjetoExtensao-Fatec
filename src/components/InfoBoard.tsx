import { Link } from 'react-router-dom'
import { editais, noticias, revista, type Post } from '../data/academicPosts'
import { usePosts } from '../lib/api'
import './InfoBoard.css'

type InfoColumn = {
  title: string
  to: string
  accent: 'orange' | 'blue' | 'navy'
  layout: 'featured' | 'top'
  items: Post[]
}

export default function InfoBoard() {
  const noticiasPosts = usePosts('noticias', noticias)
  const editaisPosts = usePosts('editais', editais)
  const revistaPosts = usePosts('revista', revista)

  const columns: InfoColumn[] = [
    { title: 'Notícias', to: '/noticias', accent: 'orange', layout: 'featured', items: noticiasPosts.slice(0, 4) },
    { title: 'Editais', to: '/editais', accent: 'blue', layout: 'top', items: editaisPosts.slice(0, 3) },
    { title: 'Revista Científica (REFI)', to: '/revista-cientifica', accent: 'navy', layout: 'top', items: revistaPosts.slice(0, 3) },
  ]

  return (
    <section className="section info-board">
      <div className="container">
        <h2 className="info-title">Editais, notícias e vida acadêmica</h2>

        <div className="info-grid">
          {columns.map((column) => (
            <div className={`info-card info-card--${column.layout} accent-${column.accent}`} key={column.title}>
              <h3>{column.title}</h3>
              <ul>
                {column.items.map((item) => (
                  <li key={item.id ?? item.title}>
                    {item.fileUrl ? (
                      <a className="info-item-link" href={item.fileUrl} target="_blank" rel="noreferrer">
                        <span className="info-item-title">{item.title} 📎</span>
                        <span className="info-item-date">{item.date}</span>
                      </a>
                    ) : (
                      <Link className="info-item-link" to={column.to}>
                        <span className="info-item-title">{item.title}</span>
                        <span className="info-item-date">{item.date}</span>
                      </Link>
                    )}
                  </li>
                ))}
                {column.items.length === 0 && (
                  <li className="info-empty">Nenhuma publicação ainda.</li>
                )}
              </ul>
              <Link to={column.to} className="info-link">Ver tudo &rarr;</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
