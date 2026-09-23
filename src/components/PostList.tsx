import { useEffect, useMemo, useState } from 'react'
import type { Post } from '../data/academicPosts'
import Reveal from './Reveal'
import './PostList.css'

type PostListProps = {
  posts: Post[]
}

const PAGE_SIZE = 10

function formatPublishedAt(iso?: string): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function FileIcon() {
  return (
    <svg className="post-file-icon" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M4 1.5h5.5L12.5 4.5V13a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 13V3A1.5 1.5 0 0 1 4 1.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M9.2 1.6V4.5h2.9" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  )
}

function PostCard({ post }: { post: Post }) {
  const publishedAt = formatPublishedAt(post.createdAt)
  const body = (
    <>
      <div className="post-card-top">
        {post.sectionLabel && <span className="post-section-tag">{post.sectionLabel}</span>}
        {publishedAt && <time className="post-published">{publishedAt}</time>}
      </div>
      <h3>
        {post.title}
        {post.fileUrl && <FileIcon />}
      </h3>
      {post.date && <span className="post-date-label">{post.date}</span>}
      {post.excerpt && <p>{post.excerpt}</p>}
    </>
  )

  if (post.fileUrl) {
    return (
      <a className="post-card card" href={post.fileUrl} target="_blank" rel="noreferrer">
        {body}
      </a>
    )
  }

  return <article className="post-card card">{body}</article>
}

export default function PostList({ posts }: PostListProps) {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [search])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return posts
    return posts.filter((post) => post.title.toLowerCase().includes(q))
  }, [posts, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  if (posts.length === 0) {
    return <p className="post-list-empty">Nenhuma publicação por aqui ainda.</p>
  }

  return (
    <div className="post-list-wrap">
      <input
        type="search"
        className="post-search"
        placeholder="Buscar por título…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Buscar publicações por título"
      />

      {filtered.length === 0 ? (
        <p className="post-list-empty">Nenhuma publicação encontrada para “{search}”.</p>
      ) : (
        <>
          <div className="post-grid">
            {paginated.map((post, index) => (
              <Reveal delay={index * 60} key={post.id ?? post.title}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="post-pagination">
              <button
                type="button"
                className="post-page-btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              <span className="post-page-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                type="button"
                className="post-page-btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
