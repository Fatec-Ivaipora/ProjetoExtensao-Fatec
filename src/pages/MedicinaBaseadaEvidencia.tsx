import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { medicinaEvidencia } from '../data/academicPosts'
import { usePosts } from '../lib/api'
import './MedicinaBaseadaEvidencia.css'

export default function MedicinaBaseadaEvidencia() {
  const posts = usePosts('medicinaEvidencia', medicinaEvidencia)
  return (
    <>
      <PageHeader
        eyebrow="Pesquisa e Extensão"
        title="Medicina Baseada em Evidência"
        description="Iniciativa voltada ao incentivo da prática clínica e acadêmica orientada por evidências científicas."
      />

      <section className="section">
        <div className="container mbe-intro">
          <p>
            A iniciativa de Medicina Baseada em Evidência reúne materiais de apoio,
            oficinas e atividades voltadas ao desenvolvimento do pensamento crítico
            científico entre estudantes e profissionais da área da saúde.
          </p>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">Materiais de apoio</h2>
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
