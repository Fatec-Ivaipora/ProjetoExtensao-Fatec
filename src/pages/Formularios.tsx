import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { formularios } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function Formularios() {
  const posts = usePosts('formularios', formularios)
  return (
    <>
      <PageHeader
        eyebrow="Documentos"
        title="Formulários"
        description="Formulários utilizados nos processos de pesquisa, extensão e iniciação científica."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
