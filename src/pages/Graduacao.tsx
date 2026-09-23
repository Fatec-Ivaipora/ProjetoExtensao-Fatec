import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { graduacao } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function Graduacao() {
  const posts = usePosts('graduacao', graduacao)
  return (
    <>
      <PageHeader
        eyebrow="Ensino"
        title="Graduação"
        description="Informações sobre o curso de graduação em Medicina da Fatec Ivaiporã."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
