import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { cep } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function Cep() {
  const posts = usePosts('cep', cep)
  return (
    <>
      <PageHeader
        eyebrow="Pesquisa"
        title="CEP — Comitê de Ética em Pesquisa"
        description="Submissão de projetos, formulários e documentos exigidos pelo Comitê de Ética em Pesquisa."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
