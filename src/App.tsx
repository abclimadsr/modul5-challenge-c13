import { useEffect, useState } from 'react'
import { NoteCard } from './components/NoteCard'
import { NoteForm } from './components/NoteForm'
import { PostsPage } from './pages/PostsPage'
import type { Note } from './types/Note'
import './App.css'

const NOTES_STORAGE_KEY = 'modul5-notes'

function isNote(value: unknown): value is Note {
  if (typeof value !== 'object' || value === null) return false
  const note = value as Record<string, unknown>

  return (
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    typeof note.content === 'string' &&
    typeof note.category === 'string'
  )
}

function readSavedNotes(): Note[] {
  try {
    const savedNotes: unknown = JSON.parse(
      localStorage.getItem(NOTES_STORAGE_KEY) ?? '[]',
    )
    return Array.isArray(savedNotes) ? savedNotes.filter(isNote) : []
  } catch (error) {
    console.error('Catatan lokal tidak dapat dibaca:', error)
    return []
  }
}

function App() {
  const [notes, setNotes] = useState<Note[]>(readSavedNotes)
  const [noteSearch, setNoteSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'notes' | 'posts'>('notes')

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
    } catch (error) {
      console.error('Catatan lokal tidak dapat disimpan:', error)
    }
  }, [notes])

  function addNote(note: Omit<Note, 'id'>) {
    setNotes((currentNotes) => [
      { ...note, id: crypto.randomUUID() },
      ...currentNotes,
    ])
  }

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(noteSearch.toLowerCase()),
  )

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">RUANG UNTUK IDE</p>
        <h1>Catatan kecil, ide besar.</h1>
        <p className="subtitle">
          Simpan catatanmu secara lokal atau jelajahi post dari REST API.
        </p>
      </header>

      <nav className="tabs" aria-label="Pilih halaman">
        <button
          className={activeTab === 'notes' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('notes')}
          type="button"
        >
          Catatan lokal <span>{notes.length}</span>
        </button>
        <button
          className={activeTab === 'posts' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('posts')}
          type="button"
        >
          REST API
        </button>
      </nav>

      {activeTab === 'notes' ? (
        <section className="workspace" aria-label="Catatan lokal">
          <div className="section-heading">
            <div>
              <p className="eyebrow">TAHAP 1</p>
              <h2>Catatanmu</h2>
            </div>
            <label className="search-field">
              <span className="visually-hidden">Cari judul catatan</span>
              <input
                onChange={(event) => setNoteSearch(event.target.value)}
                placeholder="Cari judul..."
                type="search"
                value={noteSearch}
              />
            </label>
          </div>
          <div className="notes-layout">
            <NoteForm onAdd={addNote} />
            <div className="note-list">
              {filteredNotes.length ? (
                filteredNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onDelete={(id) =>
                      setNotes((currentNotes) =>
                        currentNotes.filter((item) => item.id !== id),
                      )
                    }
                  />
                ))
              ) : (
                <p className="empty-state">
                  {noteSearch
                    ? 'Tidak ada catatan dengan judul tersebut.'
                    : 'Belum ada catatan. Mulai tulis ide pertamamu!'}
                </p>
              )}
            </div>
          </div>
          <p className="storage-hint">Catatan tersimpan otomatis di browser ini.</p>
        </section>
      ) : (
        <PostsPage />
      )}
    </main>
  )
}

export default App
