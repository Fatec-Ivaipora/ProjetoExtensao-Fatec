import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { monitoria } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function Monitoria() {
  const posts = usePosts('monitoria', monitoria)
  return (
    <>
      <PageHeader
        eyebrow="Ensino"
        title="Monitoria"
        description="Oportunidades de monitoria acadêmica para estudantes da graduação."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
