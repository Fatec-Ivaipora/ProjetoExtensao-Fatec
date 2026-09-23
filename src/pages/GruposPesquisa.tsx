import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { gruposPesquisa } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function GruposPesquisa() {
  const posts = usePosts('gruposPesquisa', gruposPesquisa)
  return (
    <>
      <PageHeader
        eyebrow="Pesquisa"
        title="Grupos de Pesquisa (GTES)"
        description="Grupos de Trabalho e Estudo (GTES) e linhas de pesquisa ativas na instituição."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
