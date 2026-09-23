import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { tccTcr } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function TccTcr() {
  const posts = usePosts('tccTcr', tccTcr)
  return (
    <>
      <PageHeader
        eyebrow="Pesquisa"
        title="TCC / TCR"
        description="Normas, prazos e materiais de apoio para o Trabalho de Conclusão de Curso e o Trabalho de Conclusão de Residência."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
