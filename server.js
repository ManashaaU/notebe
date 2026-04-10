const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Allow requests from GitHub Pages
app.use(cors());
app.use(express.json());

// In-memory store (resets on server restart)
let notes = [];
let nextId = 1;

// GET all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// POST a new note
app.post("/notes", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "text is required" });
  const note = { id: nextId++, text, createdAt: new Date().toISOString() };
  notes.push(note);
  res.status(201).json(note);
});

// DELETE a note by id
app.delete("/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  notes = notes.filter(n => n.id !== id);
  res.json({ success: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));