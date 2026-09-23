import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { cursosExtensao } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function CursosExtensao() {
  const posts = usePosts('cursosExtensao', cursosExtensao)
  return (
    <>
      <PageHeader
        eyebrow="Extensão"
        title="Cursos de Extensão"
        description="Cursos de extensão abertos à comunidade acadêmica e externa."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
