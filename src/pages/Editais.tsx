import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { editais } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function Editais() {
  const posts = usePosts('editais', editais)
  return (
    <>
      <PageHeader
        eyebrow="Publicações"
        title="Editais"
        description="Processos seletivos, bolsas e normas de pesquisa e extensão."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
