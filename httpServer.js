import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = 3000;

// In-memory array of books (no database)
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350 },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 300 },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 480 }
];

// Helper: send a JSON response
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // ---------- GET / ----------
  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to the Library Book Management System</h1>");
    return;
  }

  // ---------- GET /books ----------
  if (method === "GET" && url === "/books") {
    sendJSON(res, 200, books);
    return;
  }

  // ---------- GET /about ----------
  if (method === "GET" && url === "/about") {
    const info = {
      app: "Library Book Management App",
      version: "1.0.0",
      description: "Demonstrates Node.js HTTP module, FS module and routing.",
      author: "Your Name (GitHubID)"
    };
    sendJSON(res, 200, info);
    return;
  }

  // ---------- GET /home  (serve file using FS module) ----------
  if (method === "GET" && url === "/home") {
    const filePath = path.join(__dirname, "public", "index.html");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>500 Internal Server Error</h1><p>Could not read index.html</p>");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
    return;
  }

  // ---------- POST /add-book ----------
  if (method === "POST" && url === "/add-book") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));

    req.on("end", () => {
      let newBook;
      try {
        newBook = JSON.parse(body);
      } catch {
        return sendJSON(res, 400, { error: "Invalid JSON in request body" });
      }

      const { id, title, author, price } = newBook;

      // Validation
      if (id === undefined || !title || !author || price === undefined) {
        return sendJSON(res, 400, {
          error: "Missing required fields: id, title, author, price"
        });
      }
      if (typeof price !== "number" || price < 0) {
        return sendJSON(res, 400, { error: "price must be a non-negative number" });
      }
      if (books.some((b) => b.id === id)) {
        return sendJSON(res, 409, { error: `Book with id ${id} already exists` });
      }

      const book = { id, title, author, price };
      books.push(book);

      sendJSON(res, 201, { message: "Book added successfully", book });
    });

    return;
  }

  // ---------- 404 for all other routes / methods ----------
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "404 Not Found", route: url, method }));
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});