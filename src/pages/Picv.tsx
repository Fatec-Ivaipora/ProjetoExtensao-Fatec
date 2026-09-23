import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { picv } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function Picv() {
  const posts = usePosts('picv', picv)
  return (
    <>
      <PageHeader
        eyebrow="Pesquisa"
        title="PICV"
        description="Programa de Iniciação Científica Voluntária."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
