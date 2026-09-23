import PageHeader from '../components/PageHeader'
import ProjectGrid from '../components/ProjectGrid'
import { ligasAcademicas } from '../data/projects'

export default function LigasAcademicas() {
  return (
    <>
      <PageHeader
        eyebrow="Pesquisa e Extensão"
        title="Ligas Acadêmicas"
        description="Grupos de pesquisa e extensão organizados por estudantes, com orientação de docentes."
      />
      <section className="section">
        <div className="container">
          <ProjectGrid items={ligasAcademicas} />
        </div>
      </section>
    </>
  )
}
