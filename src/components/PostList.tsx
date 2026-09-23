import { useEffect, useMemo, useState } from 'react'
import type { Post } from '../data/academicPosts'
import Reveal from './Reveal'
import './PostList.css'

type PostListProps = {
  posts: Post[]
}

const PAGE_SIZE = 10

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
          <div className="post-list">
            {paginated.map((post, index) => (
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
