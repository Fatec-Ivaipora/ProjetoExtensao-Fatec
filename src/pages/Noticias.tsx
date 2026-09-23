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
        description="Últimas notícias e publicações da Fatec Ivaiporã, reunindo Ensino, Pesquisa, Extensão e Institucional em um só lugar."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
