export interface Post {
  id: number
  title: string
  body: string
}

export type NewPost = Omit<Post, 'id'>
