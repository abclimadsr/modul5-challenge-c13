export type NoteCategory = 'Pribadi' | 'Kuliah' | 'Kerja'

export interface Note {
  id: string
  title: string
  content: string
  category: NoteCategory
}
