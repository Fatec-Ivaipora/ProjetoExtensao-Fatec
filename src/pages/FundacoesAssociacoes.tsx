import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { fundacoesAssociacoes } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function FundacoesAssociacoes() {
  const posts = usePosts('fundacoesAssociacoes', fundacoesAssociacoes)
  return (
    <>
      <PageHeader
        eyebrow="Institucional"
        title="Fundações / Associações"
        description="Fundações e associações vinculadas à instituição que apoiam ensino, pesquisa e extensão."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
