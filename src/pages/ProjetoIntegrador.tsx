import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { projetoIntegrador } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function ProjetoIntegrador() {
  const posts = usePosts('projetoIntegrador', projetoIntegrador)
  return (
    <>
      <PageHeader
        eyebrow="Extensão"
        title="Projeto Integrador / MOPI"
        description="Projeto Integrador e Mostra de Projetos Integradores (MOPI)."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
