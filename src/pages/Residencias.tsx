import PageHeader from '../components/PageHeader'
import PostList from '../components/PostList'
import { residencias } from '../data/academicPosts'
import { usePosts } from '../lib/api'

export default function Residencias() {
  const posts = usePosts('residencias', residencias)
  return (
    <>
      <PageHeader
        eyebrow="Ensino"
        title="Residências"
        description="Programas de residência médica vinculados à instituição."
      />
      <section className="section">
        <div className="container">
          <PostList posts={posts} />
        </div>
      </section>
    </>
  )
}
