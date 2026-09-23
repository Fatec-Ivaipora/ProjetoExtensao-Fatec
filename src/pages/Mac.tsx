import PageHeader from '../components/PageHeader'
import ProjectGrid from '../components/ProjectGrid'
import { mac } from '../data/projects'

export default function Mac() {
  return (
    <>
      <PageHeader
        eyebrow="Pesquisa e Extensão"
        title="Mostra de Iniciação Científica — MAC"
        description="Evento anual que reúne os trabalhos de iniciação científica desenvolvidos pelos estudantes."
      />
      <section className="section">
        <div className="container">
          <ProjectGrid items={mac} />
        </div>
      </section>
    </>
  )
}
