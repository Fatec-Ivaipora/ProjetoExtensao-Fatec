import type { Post } from '../data/academicPosts'
import Reveal from './Reveal'
import './PostList.css'

type PostListProps = {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return <p className="post-list-empty">Nenhuma publicação por aqui ainda.</p>
  }
  return (
    <div className="post-list">
      {posts.map((post, index) => (
        <Reveal delay={index * 60} key={post.id ?? post.title}>
          <article className="post-card card">
            {post.sectionLabel && <span className="post-section-tag">{post.sectionLabel}</span>}
            <span className="post-date">{post.date}</span>
            <h3>
              {post.fileUrl ? (
                <a className="post-file-link" href={post.fileUrl} target="_blank" rel="noreferrer">
                  {post.title} 📎
                </a>
              ) : (
                post.title
              )}
            </h3>
            {post.excerpt && <p>{post.excerpt}</p>}
          </article>
        </Reveal>
      ))}
    </div>
  )
}
