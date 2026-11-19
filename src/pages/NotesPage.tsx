import { useState } from "react";
import type { Note } from "../types/note";
import { useLocalStorage } from "../hooks/useLocalStorage";
import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";

export default function NotesPage() {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", []);
  const [search, setSearch] = useState("");

  const addNote = (data: Omit<Note, "id">) => {
    setNotes([...notes, { id: Date.now(), ...data }]);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const filtered = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Papan Catatan</h2>
      <NoteForm onAdd={addNote} />
      <input
        className="search"
        placeholder="Cari judul..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filtered.length === 0 && <p>Tidak ada catatan.</p>}
      {filtered.map((n) => (
        <NoteCard key={n.id} note={n} onDelete={deleteNote} />
      ))}
    </div>
  );
}