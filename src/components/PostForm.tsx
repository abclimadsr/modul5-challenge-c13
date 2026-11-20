import { useState, type FormEvent } from 'react'
import type { NewPost } from '../types/post'

interface PostFormProps {
  isSubmitting: boolean
  onSubmit: (post: NewPost) => Promise<boolean>
}

export function PostForm({ isSubmitting, onSubmit }: PostFormProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const saved = await onSubmit({ title: title.trim(), body: body.trim() })
    if (saved) {
      setTitle('')
      setBody('')
    }
  }

  return (
    <form className="post-form" onSubmit={(event) => void handleSubmit(event)}>
      <h3>Tulis post baru</h3>
      <label>
        Judul
        <input
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Judul post"
          required
          value={title}
        />
      </label>
      <label>
        Isi post
        <textarea
          onChange={(event) => setBody(event.target.value)}
          placeholder="Isi post"
          required
          rows={3}
          value={body}
        />
      </label>
      <button className="primary-button" disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Mengirim...' : 'Kirim post'}
      </button>
    </form>
  )
}
