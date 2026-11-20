import { useEffect, useState } from 'react'
import { PostForm } from '../components/PostForm'
import type { NewPost, Post } from '../types/post'

const POSTS_API_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/posts'

async function readApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`Server merespons dengan status ${response.status}.`)
  }

  return response.json() as Promise<T>
}

function getErrorMessage(error: unknown, action: string) {
  const detail =
    error instanceof Error ? error.message : 'Periksa koneksi ke server.'
  return `Gagal ${action}: ${detail}`
}

export function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const requestUrl = new URL(POSTS_API_URL, window.location.origin)
    if (search.trim()) {
      requestUrl.searchParams.set('search', search.trim())
    } else {
      requestUrl.searchParams.delete('search')
    }

    async function loadPosts() {
      setLoading(true)
      setErrorMessage('')

      try {
        const response = await fetch(requestUrl, { signal: controller.signal })
        const result = await readApiResponse<Post[]>(response)
        setPosts(result)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
        setPosts([])
        setErrorMessage(getErrorMessage(error, 'memuat post'))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadPosts()
    return () => controller.abort()
  }, [search])

  async function createPost(post: NewPost) {
    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const response = await fetch(POSTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })
      const createdPost = await readApiResponse<Post>(response)
      setPosts((previousPosts) => [createdPost, ...previousPosts])
      return true
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'menambahkan post'))
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deletePost(id: number) {
    setDeletingPostId(id)
    setErrorMessage('')

    try {
      const response = await fetch(
        `${POSTS_API_URL.replace(/\/$/, '')}/${encodeURIComponent(id)}`,
        { method: 'DELETE' },
      )
      if (!response.ok) {
        throw new Error(`Server merespons dengan status ${response.status}.`)
      }
      setPosts((previousPosts) => previousPosts.filter((post) => post.id !== id))
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'menghapus post'))
    } finally {
      setDeletingPostId(null)
    }
  }

  return (
    <section className="workspace" aria-label="Post REST API">
      <div className="section-heading">
        <div>
          <p className="eyebrow">TAHAP 2</p>
          <h2>Post dari API</h2>
        </div>
        <label className="search-field">
          <span className="visually-hidden">Cari post</span>
          <input
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari post..."
            type="search"
            value={search}
          />
        </label>
      </div>

      <PostForm isSubmitting={isSubmitting} onSubmit={createPost} />

      {errorMessage && (
        <p className="error-message" role="alert">
          {errorMessage}
        </p>
      )}
      {loading ? (
        <p className="status-message" role="status">
          Memuat post...
        </p>
      ) : posts.length ? (
        <div className="post-list">
          {posts.map((post) => (
            <article className="post-card" key={post.id}>
              <div>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <small>Post #{post.id}</small>
              </div>
              <button
                aria-label={`Hapus post ${post.title}`}
                className="delete-button"
                disabled={deletingPostId === post.id}
                onClick={() => void deletePost(post.id)}
                type="button"
              >
                {deletingPostId === post.id ? 'Menghapus...' : 'Hapus'}
              </button>
            </article>
          ))}
        </div>
      ) : (
        !errorMessage && (
          <p className="empty-state">
            {search
              ? 'Tidak ada post yang cocok dengan pencarian.'
              : 'Belum ada post.'}
          </p>
        )
      )}
      <p className="storage-hint">
        Endpoint: <code>{POSTS_API_URL}</code>
      </p>
    </section>
  )
}
