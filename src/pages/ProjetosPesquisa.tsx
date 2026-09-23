import PageHeader from '../components/PageHeader'
import ProjectGrid from '../components/ProjectGrid'
import { projetosPesquisa } from '../data/projects'

export default function ProjetosPesquisa() {
  return (
    <>
      <PageHeader
        eyebrow="Pesquisa e Extensão"
        title="Projetos de Pesquisa"
        description="Iniciativas de pesquisa e extensão desenvolvidas por docentes e alunos da área da saúde."
      />
      <section className="section">
        <div className="container">
          <ProjectGrid items={projetosPesquisa} />
        </div>
      </section>
    </>
  )
}
