import PageHeader from '../components/PageHeader'
import ProjectGrid from '../components/ProjectGrid'
import { pic } from '../data/projects'

export default function Pic() {
  return (
    <>
      <PageHeader
        eyebrow="Pesquisa e Extensão"
        title="Projetos de Iniciação Científica — PIC"
        description="Projetos desenvolvidos por estudantes sob orientação docente, com foco em iniciação à pesquisa."
      />
      <section className="section">
        <div className="container">
          <ProjectGrid items={pic} />
        </div>
      </section>
    </>
  )
}
