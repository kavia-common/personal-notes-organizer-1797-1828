import React, { useState, useEffect } from "react";
import NotesList from "./NotesList.jsx";
import NoteDetails from "./NoteDetails.jsx";

// LOCAL STORAGE KEY
const LOCAL_STORAGE_KEY = "notesapp.notes";

// PUBLIC_INTERFACE
function loadNotesFromStorage() {
  /** Loads notes from local storage, fallback to [] */
  if (typeof window !== "undefined") {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }
  return [];
}

// PUBLIC_INTERFACE
function saveNotesToStorage(notes) {
  /** Persists notes array to localStorage. */
  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }
}

// NoteEditor definition (must be in this file for logic)
function NoteEditor({ initialNote, onSave, onCancel }) {
  const [title, setTitle] = useState(initialNote.title || '');
  const [body, setBody] = useState(initialNote.body || '');

  useEffect(() => {
    setTitle(initialNote.title || '');
    setBody(initialNote.body || '');
  }, [initialNote]);

  function handleSubmit(event) {
    event.preventDefault();
    if (title.trim() === "") return;
    onSave({ title: title.trim(), body });
  }

  return (
    <form className="note-editor" onSubmit={handleSubmit} autoComplete="off">
      <input
        className="note-title-input"
        type="text"
        required
        value={title}
        maxLength={64}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        autoFocus
      />
      <textarea
        className="note-body-input"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={8}
        placeholder="Type your note here..."
      ></textarea>
      <div className="editor-actions">
        <button type="submit" className="save-btn">
          Save
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
      <style>{`
        .note-editor {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: #fbfdff;
          border-radius: 7px;
          box-shadow: 0 1.5px 7px 0 rgba(25,118,210,0.06);
          border: 1px solid #e3e9f4;
          padding: 1.1rem 1.3rem 1.4rem 1.5rem;
          min-width: 0;
        }
        .note-title-input {
          font-size: 1.13rem;
          font-weight: 600;
          color: #1976D2;
          border: none;
          border-bottom: 2px solid #1976D2;
          outline: none;
          background: transparent;
          padding: 0.45em 0;
          margin-bottom: 0.5rem;
        }
        .note-title-input::placeholder {
          color: #aabcef;
        }
        .note-body-input {
          min-height: 120px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          padding: 0.7em 0.7em 0.7em 0.9em;
          font-size: 1rem;
          color: #424242;
          background: #fff;
        }
        .editor-actions {
          display: flex;
          gap: 1em;
          justify-content: flex-end;
          margin-top: 0.1em;
        }
        .save-btn {
          background: #1976D2;
          color: #fff;
          border: none;
          border-radius: 5px;
          padding: 0.48em 1.4em;
          font-weight: 600;
          font-size: 1.03em;
          cursor: pointer;
          transition: background .13s;
        }
        .save-btn:hover, .save-btn:focus {
          background: #11529d;
        }
        .cancel-btn {
          background: #fff;
          color: #1976D2;
          border: 1px solid #1976D2;
          border-radius: 5px;
          padding: 0.48em 1.4em;
          font-weight: 500;
          font-size: 1.03em;
          cursor: pointer;
          transition: background .13s, color .13s;
        }
        .cancel-btn:hover, .cancel-btn:focus {
          background: #1976D2;
          color: #fff;
        }
        @media (max-width: 624px) {
          .note-editor { padding: 0.6rem 0.5rem 1rem 0.75rem;}
        }
      `}</style>
    </form>
  );
}

export default function NotesMain() {
  /** Main notes management: handles local state for demo */
  const [notes, setNotes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [mode, setMode] = useState("list"); // 'list'|'create'|'edit'
  const [editNote, setEditNote] = useState(null);

  // Load from storage on first render
  useEffect(() => {
    setNotes(loadNotesFromStorage());
  }, []);

  // Save to storage when notes change
  useEffect(() => {
    saveNotesToStorage(notes);
  }, [notes]);

  // PUBLIC_INTERFACE
  function handleSelectNote(noteId) {
    setSelectedId(noteId);
    setMode("list");
  }

  // PUBLIC_INTERFACE
  function handleCreate() {
    setMode("create");
    setEditNote(null);
  }

  // PUBLIC_INTERFACE
  function handleEdit(note) {
    setMode("edit");
    setEditNote(note);
  }

  // PUBLIC_INTERFACE
  function handleDelete(noteId) {
    const filtered = notes.filter((n) => n.id !== noteId);
    setNotes(filtered);
    if (selectedId === noteId) setSelectedId(null);
    setMode("list");
  }

  // PUBLIC_INTERFACE
  function handleSave(note) {
    if (mode === "edit" && editNote) {
      // Update
      setNotes(notes.map((n) => (n.id === editNote.id ? { ...note, id: editNote.id } : n)));
      setSelectedId(editNote.id);
    } else {
      // Create
      const newId = Date.now().toString();
      setNotes([{ ...note, id: newId }, ...notes]);
      setSelectedId(newId);
    }
    setMode("list");
    setEditNote(null);
  }

  // PUBLIC_INTERFACE
  function handleCancelEdit() {
    setMode("list");
    setEditNote(null);
  }

  // API: For future backend hookup, you can swap calls to fetch API here instead of localStorage.

  // Get current selection
  const selectedNote = notes.find((n) => n.id === selectedId);

  return (
    <main className="notes-main">
      <section className="notes-list-panel" aria-label="Notes list panel">
        <div className="notes-list-header">
          <h2>Notes</h2>
          <button className="create-btn" title="Create note" onClick={handleCreate}>
            <span className="plus-icon">+</span>
            New
          </button>
        </div>
        <NotesList
          notes={notes}
          selectedId={selectedId}
          onSelect={handleSelectNote}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
      <section className="notes-detail-panel" aria-label="Note details or edit">
        {mode === "list" && selectedNote && (
          <NoteDetails
            note={selectedNote}
            onEdit={() => handleEdit(selectedNote)}
            onDelete={() => handleDelete(selectedNote.id)}
          />
        )}
        {mode === "list" && !selectedNote && (
          <div className="select-placeholder">
            <span>Select a note or create a new one to get started.</span>
          </div>
        )}
        {(mode === "create" || mode === "edit") && (
          <NoteEditor
            initialNote={mode === "edit" ? editNote : { title: "", body: "" }}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        )}
      </section>
      <style>{`
        .notes-main {
          display: flex;
          flex: 1 1 0%;
          min-height: 0;
          width: 100%;
          background: var(--bg-color);
        }
        .notes-list-panel {
          flex: 0 0 270px;
          border-right: 1px solid #e0e0e0;
          background: #fafbfc;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
        .notes-list-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.4rem 1rem 1rem;
        }
        .notes-list-header h2 {
          margin: 0;
          font-size: 1.12rem;
          color: #1976D2;
          font-weight: 700;
          letter-spacing: .03em;
        }
        .create-btn {
          background: #1976D2;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 0.4em 1.05em;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5em;
          cursor: pointer;
          transition: background .16s;
          font-size: 1em;
        }
        .create-btn:hover, .create-btn:focus {
          background: #1560b3;
          color: #FFC107;
        }
        .plus-icon {
          font-size: 1.25em;
          font-weight: 900;
        }
        .notes-detail-panel {
          flex: 1;
          min-width: 0;
          padding: 1.7rem 2rem 1.7rem 2.4rem;
          background: #fff;
          display: flex;
          flex-direction: column;
        }
        .select-placeholder {
          font-size: 1.06rem;
          color: #888;
          margin-top: 20%;
          text-align: center;
        }
        @media (max-width: 900px) {
          .notes-list-panel {
            flex-basis: 36%;
            min-width: 160px;
          }
        }
        @media (max-width: 750px) {
          .notes-main {
            flex-direction: column;
          }
          .notes-list-panel {
            border-right: none;
            border-bottom: 1px solid #e0e0e0;
            flex-basis: auto;
            min-height: 112px;
            max-height: 210px;
          }
          .notes-detail-panel {
            padding: 1rem 0.5rem 1.5rem 0.5rem;
          }
        }
        @media (max-width: 500px) {
          .notes-detail-panel { padding: 0.45rem 0.05rem 1rem 0.05rem;}
          .notes-list-panel { min-width: 90px; }
        }
      `}</style>
    </main>
  );
}
