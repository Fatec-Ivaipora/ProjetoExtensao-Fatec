import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { projetosExtensao } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function ProjetosExtensao() {
  const posts = usePosts('projetosExtensao', projetosExtensao)
  return (
    <>
      <PageHeader
        eyebrow="Extensão"
        title="Projetos de Extensão"
        description="Projetos de extensão em desenvolvimento pela instituição."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
