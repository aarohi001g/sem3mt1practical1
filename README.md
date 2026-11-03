# MT1-LABEXAM

Library Book Management application built with Node.js ES Modules (no database, in-memory arrays).

## Part A — httpServer.js (Port 3000)

Built using Node's built-in `http` and `fs` modules (no Express).

| Route       | Method | Description                                 |
| ----------- | ------ | ------------------------------------------- |
| `/`         | GET    | HTML response                               |
| `/books`    | GET    | Book data as JSON                           |
| `/about`    | GET    | Library information                         |
| `/home`     | GET    | Serves `public/index.html` via FS module    |
| `/add-book` | POST   | Validates and adds a book (201 / 400 / 409) |

Run: `node httpServer.js`

## Part B — expressApp.js (Port 4000)

Built using Express with `express.json()` middleware.

| Route        | Method | Description                      |
| ------------ | ------ | -------------------------------- |
| `/books`     | GET    | List all books                   |
| `/books/:id` | GET    | Get single book (404 if missing) |
| `/books`     | POST   | Create book (201)                |
| `/books/:id` | PUT    | Update book (404 if missing)     |
| `/books/:id` | DELETE | Delete book (404 if missing)     |

Run: `node expressApp.js`

## Setup

```bash
npm install
```
