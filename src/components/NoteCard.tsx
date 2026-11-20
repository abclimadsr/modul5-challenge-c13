import type { Note } from '../types/Note'

interface NoteCardProps {
  note: Note
  onDelete: (id: string) => void
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <article className="note-card">
      <div className="note-card-top">
        <span className="category-badge">{note.category}</span>
        <button
          aria-label={`Hapus catatan ${note.title}`}
          className="delete-button"
          onClick={() => onDelete(note.id)}
          type="button"
        >
          Hapus
        </button>
      </div>
      <h3>{note.title}</h3>
      <p>{note.content}</p>
    </article>
  )
}
