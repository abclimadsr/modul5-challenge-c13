# Catatan Lokal + REST API

Aplikasi React + TypeScript untuk catatan lokal dan pengelolaan post dengan Express + Neon.

## Persiapan

1. Install dependency: `npm install`.
2. Salin `.env.example` menjadi `.env`, lalu isi `DATABASE_URL` dari Neon.
3. Jalankan SQL di `server/schema.sql` pada Neon SQL Editor untuk membuat tabel `posts`.
4. Jalankan dua terminal dari root proyek:

   ```sh
   npm run dev:server
   ```

   ```sh
   npm run dev
   ```

Frontend tersedia di URL Vite (biasanya `http://localhost:5173`); API berjalan di `http://localhost:3000`.

## Endpoint

- `GET /api/posts` menampilkan post. Parameter opsional `?search=...` mencari judul maupun isi dengan SQL `ILIKE`.
- `POST /api/posts` menerima JSON `{ "title": "...", "body": "..." }`.
- `DELETE /api/posts/:id` menghapus post berdasarkan ID.

Express mengaktifkan `cors()` untuk origin frontend dan `express.json()` untuk membaca body JSON. Origin dapat diatur lewat `CLIENT_ORIGIN`. URL API frontend dapat diatur lewat `VITE_API_URL` di `.env`.

## Struktur fitur

- `src/App.tsx`: navigasi tab Catatan dan Post.
- `src/types/post.ts`: tipe data post.
- `src/components/PostForm.tsx`: form controlled untuk menambah post.
- `src/pages/PostsPage.tsx`: GET, POST, DELETE, loading/error, dan pencarian dengan `useEffect` saat `search` berubah.
- `server/index.js`: Express API dan query Neon.
- `server/schema.sql`: skema tabel post.

Jalankan `npm run build` dan `npm run lint` untuk validasi frontend.
