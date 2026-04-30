# 📚 Bookshelf

A personal reading tracker built to replace a long-running notes file of books and reviews. The project started as a way to explore full-stack development, AI-assisted development workflows, and how modern tooling could be applied to something I actually use. The longer goal is an augmented bookshelf: AI-driven reading insights, pattern analysis across your reviews, and eventually a visual shelf of every book you have read whether it be e-book or physical.

## Screenshots

<table>
  <tr>
    <td><img src="assets/screenshots/book-list.png" /></td>
    <td><img src="assets/screenshots/add-book.png" /></td>
  </tr>
  <tr>
    <td colspan="2"><em>Data for illustration purposes only.</em></td>
  </tr>
</table>

## Progression

<table>
  <tr>
    <td><img src="assets/screenshots/v1.png" /></td>
    <td><img src="assets/screenshots/v2.png" /></td>
    <td><img src="assets/screenshots/v3.png" /></td>
  </tr>
</table>

## Features

- **Log every book you finish -** title, author, a full review and a personal rating
- **Half-star ratings -** from 0.5 to 5.0, so you can actually distinguish a 3.5 from a 4
- **OpenLibrary API integration -** start typing a title and book metadata (author, cover, page count) is fetched and filled in automatically
- **Reading stats -** see your total books, years of reading, and pages read at a glance
- **Organised by year -** with a sidebar that lets you jump straight to any year in your history
- **Reviews that don't crowd the card -** long reviews collapse gracefully and expand on click
- **Dark mode -** of course

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React (TypeScript), Tailwind CSS |
| Backend  | FastAPI (Python) |
| Database | PostgreSQL |

## Getting Started

**Prerequisites:** Python 3, Node.js 18+, PostgreSQL

1. Install dependencies:
   ```bash
   make install
   ```

2. Copy the example env file and fill in your database connection:
   ```bash
   cp backend/.env.example backend/.env
   ```

3. Start both servers in separate terminals:
   ```bash
   make dev-backend   # API on :8000
   make dev-frontend  # UI on :5173
   ```

4. Open **http://localhost:5173** and start adding books to your library!

Database tables are created automatically on first backend startup. Once the backend is running, interactive API docs are available at `http://localhost:8000/docs`.

## Development

| Command             | Description |
|---------------------|-------------|
| `make install`      | Create virtualenv and install all dependencies |
| `make dev-backend`  | Start FastAPI with hot reload |
| `make dev-frontend` | Start Vite dev server |
