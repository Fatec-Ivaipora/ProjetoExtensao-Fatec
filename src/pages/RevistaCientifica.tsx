import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { revista } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function RevistaCientifica() {
  const posts = usePosts('revista', revista)
  return (
    <>
      <PageHeader
        eyebrow="Publicações"
        title="Revista Eletrônica Fatec Ivaiporã — REFI"
        description="Publicação científica com artigos de docentes, discentes e parceiros da área da saúde."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
