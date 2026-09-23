import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { useAllPosts } from '../lib/api'

export default function Noticias() {
  const posts = useAllPosts()
  return (
    <>
      <PageHeader
        eyebrow="Institucional"
        title="Notícias"
        description="Mural geral do site: toda publicação feita em qualquer área — Ensino, Pesquisa, Extensão e Institucional — aparece aqui também."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
