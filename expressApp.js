import express from "express";

const app = express();
const PORT = 4000;

// JSON parsing middleware
app.use(express.json());

// Start with at least three sample books
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", price: 350, category: "Fiction" },
  { id: 2, title: "Wings of Fire", author: "A. P. J. Abdul Kalam", price: 300, category: "Biography" },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 480, category: "Self-Help" }
];

// GET /books  -> all books
app.get("/books", (req, res) => {
  res.status(200).json(books);
});

// GET /books/:id -> one book by ID
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const book = books.find((b) => b.id === id);
  if (!book) {
    return res.status(404).json({ message: `Book with id ${id} not found` });
  }
  res.status(200).json(book);
});

// POST /books -> add a new book
app.post("/books", (req, res) => {
  const { id, title, author, price, category } = req.body;

  if (id === undefined || !title || !author || price === undefined) {
    return res.status(400).json({
      message: "Missing required fields: id, title, author, price"
    });
  }
  if (books.some((b) => b.id === Number(id))) {
    return res.status(409).json({ message: `Book with id ${id} already exists` });
  }

  const newBook = { id: Number(id), title, author, price, category: category || "General" };
  books.push(newBook);

  // 201 = Created (required by the exam)
  res.status(201).json({ message: "Book added successfully", book: newBook });
});

// PUT /books/:id -> update a book
app.put("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Book with id ${id} not found` });
  }

  const { title, author, price, category } = req.body;
  // Keep existing values if a field isn't provided
  books[index] = {
    ...books[index],
    title: title ?? books[index].title,
    author: author ?? books[index].author,
    price: price ?? books[index].price,
    category: category ?? books[index].category
  };

  res.status(200).json({ message: "Book updated successfully", book: books[index] });
});

// DELETE /books/:id -> remove a book
app.delete("/books/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = books.findIndex((b) => b.id === id);

  if (index === -1) {
    return res.status(404).json({ message: `Book with id ${id} not found` });
  }

  const deleted = books.splice(index, 1)[0];
  res.status(200).json({ message: "Book deleted successfully", book: deleted });
});

// Fallback 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});