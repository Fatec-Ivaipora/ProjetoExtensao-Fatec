import type { Project } from '../data/projects'
import Reveal from './Reveal'
import './ProjectGrid.css'

type ProjectGridProps = {
  items: Project[]
}

export default function ProjectGrid({ items }: ProjectGridProps) {
  if (items.length === 0) {
    return <p className="project-grid-empty">Nenhum projeto cadastrado ainda.</p>
  }
  return (
    <div className="project-grid">
      {items.map((item, index) => (
        <Reveal delay={index * 70} key={item.title}>
          <div className="project-card card">
            <span className={`project-tag ${item.tone === 'orange' ? 'tag-orange' : 'tag-blue'}`}>
              {item.tag}
            </span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}
