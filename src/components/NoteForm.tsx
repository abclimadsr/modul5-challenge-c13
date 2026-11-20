import { useState, type FormEvent } from 'react'
import type { Note, NoteCategory } from '../types/Note'

const categories: NoteCategory[] = ['Pribadi', 'Kuliah', 'Kerja']

interface NoteFormProps {
  onAdd: (note: Omit<Note, 'id'>) => void
}

export function NoteForm({ onAdd }: NoteFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<NoteCategory>('Pribadi')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onAdd({ title: title.trim(), content: content.trim(), category })
    setTitle('')
    setContent('')
    setCategory('Pribadi')
  }

  function handleCategoryChange(value: string) {
    const selectedCategory = categories.find((item) => item === value)
    if (selectedCategory) setCategory(selectedCategory)
  }

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <p className="eyebrow">CATATAN BARU</p>
      <label>
        Judul
        <input
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Contoh: Ide akhir pekan"
          required
          value={title}
        />
      </label>
      <label>
        Isi catatan
        <textarea
          onChange={(event) => setContent(event.target.value)}
          placeholder="Tulis sesuatu yang ingin kamu ingat..."
          required
          rows={5}
          value={content}
        />
      </label>
      <label>
        Kategori
        <select
          onChange={(event) => handleCategoryChange(event.target.value)}
          value={category}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <button className="primary-button" type="submit">
        Simpan catatan
      </button>
    </form>
  )
}
