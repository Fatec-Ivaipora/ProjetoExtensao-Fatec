import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { sucupira } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function Sucupira() {
  const posts = usePosts('sucupira', sucupira)
  return (
    <>
      <PageHeader
        eyebrow="Extensão"
        title="Sucupira"
        description="Programas de extensão cadastrados na Plataforma Sucupira, como Riso, Fateco e Sangue Bom."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
