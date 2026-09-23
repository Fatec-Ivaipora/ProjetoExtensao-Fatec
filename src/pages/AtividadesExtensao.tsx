import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { atividadesExtensao } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function AtividadesExtensao() {
  const posts = usePosts('atividadesExtensao', atividadesExtensao)
  return (
    <>
      <PageHeader
        eyebrow="Extensão"
        title="Atividades de Extensão"
        description="Atividades e ações de extensão promovidas pela instituição."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
