# Community Notice Board

A small Node.js + Express + SQLite3 web app built for the Secure Application Programming project.
Users can register, log in, post notices, comment and search.

The repo has three branches:

| Branch | Contents |
|---|---|
| `main` | Base skeleton, README (this configuration manual), `.gitignore` |
| `insecure` | Deliberately vulnerable build (SQL injection, reflected/stored/DOM XSS, sensitive data exposure) |
| `secure` | Mitigated build with logging and monitoring |

> ⚠️ The `insecure` branch is intentionally vulnerable. Run it only locally, never on a public server.

## Requirements

- Node.js 18 or higher
- npm
- Git

## Setup

```bash
git clone https://github.com/YOUR-USERNAME/community-notice-board.git
cd community-notice-board
git checkout insecure   # or: git checkout secure
npm install
npm run seed            # creates db/notice_board.db with sample data
npm start               # or: npm run dev (auto-restarts on changes)
```

Open http://localhost:3000

## Sample accounts (after seeding)

| Username | Password |
|---|---|
| alice | password123 |
| bob | letmein |
| admin | admin |

## Configuration

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `3000` | Port the server listens on |
| `SESSION_SECRET` | `dev-secret-change-me` | Secret used to sign session cookies |
| `DB_PATH` | `db/notice_board.db` | Location of the SQLite database file |

## Project structure

```
app.js              Express app entry point
db/database.js      SQLite connection + schema
db/seed.js          Sample data
routes/             Feature routes (auth, notices, search, profile)
views/              EJS templates
public/             CSS and client-side JS
```
