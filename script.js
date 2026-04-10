// ⚠️ Replace this with your actual Render URL after deploying the backend
const API = "https://YOUR_RENDER_URL.onrender.com";

async function loadNotes() {
  setStatus("Loading...");
  try {
    const res = await fetch(`${API}/notes`);
    const notes = await res.json();
    renderNotes(notes);
    setStatus("");
  } catch (err) {
    setStatus("Cannot reach server. Is the backend running?");
  }
}

async function addNote() {
  const input = document.getElementById("note-input");
  const text = input.value.trim();
  if (!text) return;

  setStatus("Saving...");
  try {
    await fetch(`${API}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    input.value = "";
    await loadNotes();
  } catch (err) {
    setStatus("Failed to save note.");
  }
}

async function deleteNote(id) {
  setStatus("Deleting...");
  try {
    await fetch(`${API}/notes/${id}`, { method: "DELETE" });
    await loadNotes();
  } catch (err) {
    setStatus("Failed to delete note.");
  }
}

function renderNotes(notes) {
  const list = document.getElementById("notes-list");
  if (notes.length === 0) {
    list.innerHTML = `<p style="color:#aaa;font-size:14px;">No notes yet. Add one above!</p>`;
    return;
  }
  list.innerHTML = notes.reverse().map(n => `
    <div class="note-card">
      <div>
        <div class="note-text">${escapeHtml(n.text)}</div>
        <div class="note-time">${new Date(n.createdAt).toLocaleString()}</div>
      </div>
      <button class="delete-btn" onclick="deleteNote(${n.id})">Delete</button>
    </div>
  `).join("");
}

function setStatus(msg) {
  document.getElementById("status").textContent = msg;
}

function escapeHtml(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// Load notes on page load
loadNotes();

// Allow pressing Enter to add a note
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("note-input").addEventListener("keydown", e => {
    if (e.key === "Enter") addNote();
  });
});