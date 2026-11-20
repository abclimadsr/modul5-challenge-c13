import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { neon } from '@neondatabase/serverless'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL belum diatur. Isi file .env sebelum menyalakan server.')
}

const sql = neon(databaseUrl)
const app = express()
const port = Number(process.env.PORT ?? 3000)
const allowedOrigins = (
  process.env.CLIENT_ORIGIN ??
  'http://localhost:5173,http://127.0.0.1:5173'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT harus berupa angka antara 1 dan 65535.')
}

app.use(cors({ origin: allowedOrigins }))
app.use(express.json({ limit: '1mb' }))

function asyncRoute(handler) {
  return (request, response, next) => {
    Promise.resolve(handler(request, response, next)).catch(next)
  }
}

app.get(
  '/api/posts',
  asyncRoute(async (request, response) => {
    const search = request.query.search
    if (search !== undefined && typeof search !== 'string') {
      return response.status(400).json({ message: 'Parameter search harus berupa teks.' })
    }

    const term = search?.trim() ?? ''
    const posts = term
      ? await sql`
          SELECT id, title, body
          FROM posts
          WHERE title ILIKE ${`%${term}%`} OR body ILIKE ${`%${term}%`}
          ORDER BY created_at DESC, id DESC
        `
      : await sql`
          SELECT id, title, body
          FROM posts
          ORDER BY created_at DESC, id DESC
        `

    response.json(posts)
  }),
)

app.post(
  '/api/posts',
  asyncRoute(async (request, response) => {
    const { title, body } = request.body ?? {}
    if (
      typeof title !== 'string' ||
      typeof body !== 'string' ||
      !title.trim() ||
      !body.trim()
    ) {
      return response
        .status(400)
        .json({ message: 'title dan body wajib diisi dengan teks.' })
    }

    if (title.trim().length > 200 || body.trim().length > 10000) {
      return response
        .status(400)
        .json({ message: 'Judul maksimal 200 karakter dan isi maksimal 10000 karakter.' })
    }

    const [post] = await sql`
      INSERT INTO posts (title, body)
      VALUES (${title.trim()}, ${body.trim()})
      RETURNING id, title, body
    `

    response.status(201).json(post)
  }),
)

app.delete(
  '/api/posts/:id',
  asyncRoute(async (request, response) => {
    const id = Number(request.params.id)
    if (!Number.isSafeInteger(id) || id < 1) {
      return response.status(400).json({ message: 'id post tidak valid.' })
    }

    const deletedPosts = await sql`
      DELETE FROM posts
      WHERE id = ${id}
      RETURNING id
    `

    if (deletedPosts.length === 0) {
      return response.status(404).json({ message: 'Post tidak ditemukan.' })
    }

    response.status(204).end()
  }),
)

app.use((request, response) => {
  response.status(404).json({ message: 'Endpoint tidak ditemukan.' })
})

app.use((error, request, response, next) => {
  if (error.status >= 400 && error.status < 500) {
    return response.status(error.status).json({ message: error.message })
  }

  console.error('Kesalahan API:', error)
  response.status(500).json({ message: 'Terjadi kesalahan pada server.' })
})

app.listen(port, () => {
  console.log(`API berjalan di http://localhost:${port}`)
})
