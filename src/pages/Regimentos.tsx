import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { regimentos } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function Regimentos() {
  const posts = usePosts('regimentos', regimentos)
  return (
    <>
      <PageHeader
        eyebrow="Documentos"
        title="Regimentos"
        description="Regulamentos que orientam as atividades de pesquisa e extensão da unidade."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
