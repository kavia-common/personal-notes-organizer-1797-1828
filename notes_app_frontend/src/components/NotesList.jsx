import React from "react";

/**
 * NotesList.jsx
 * List view of all notes.
 * Props:
 * - notes: Array of {id, title, body}
 * - selectedId: current selected note id
 * - onSelect: fn(id) => void
 * - onEdit: fn(note) => void
 * - onDelete: fn(id) => void
 */
export default function NotesList({ notes = [], selectedId, onSelect, onEdit, onDelete }) {
  function handleSelect(id) {
    if (typeof onSelect === "function") onSelect(id);
  }
  function handleEdit(event, note) {
    event.stopPropagation();
    if (typeof onEdit === "function") onEdit(note);
  }
  function handleDelete(event, id) {
    event.stopPropagation();
    if (typeof onDelete === "function" && window.confirm("Delete this note?")) onDelete(id);
  }
  return (
    <ul className="notes-list" role="listbox" aria-label="Your notes">
      {notes.length === 0 && (
        <li className="note-item empty">No notes found.</li>
      )}
      {notes.map((note) => (
        <li
          key={note.id}
          className={`note-item${selectedId === note.id ? " selected" : ""}`}
          aria-selected={selectedId === note.id}
          tabIndex={0}
          onClick={() => handleSelect(note.id)}
          onKeyDown={e => e.key === "Enter" && handleSelect(note.id)}
        >
          <div className="title-row">
            <span className="note-title">{note.title}</span>
            <span className="note-actions">
              <button className="icon-btn" title="Edit" onClick={e=>handleEdit(e, note)}>
                <svg width="17" height="17" fill="none" viewBox="0 0 20 20"><rect x="3.6" y="0.83" width="8" height="2" rx="1" transform="rotate(45 3.6 0.83)" fill="#1976D2"/><rect width="2" height="10" rx="1" transform="matrix(.70711 .70711 -.70711 .70711 14.799 1.782)" fill="#1976D2"/><rect width="15" height="1.5" rx=".66" fill="#FFF" opacity=".6" x="1.9" y="15" /></svg>
              </button>
              <button className="icon-btn" title="Delete" onClick={e=>handleDelete(e, note.id)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><rect x="6" y="8" width="8" height="1.7" rx="0.8" fill="#ff4141"/><rect x="6" y="10.3" width="8" height="1.7" rx=".8" fill="#ff4141"/></svg>
              </button>
            </span>
          </div>
          <div className="note-snippet">{note.body.slice(0, 64)}{note.body.length > 64 ? '…' : ''}</div>
        </li>
      ))}
      <style>{`
      .notes-list {
        list-style: none;
        margin: 0;
        padding: 0.2em 0.6em 0.5em 0.7em;
        flex: 1 1 0%;
        max-height: 67vh;
        overflow-y: auto;
      }

      .note-item {
        padding: 0.45em 0.77em 0.38em 1.25em;
        border-radius: 5px;
        margin-bottom: 0.24em;
        background: none;
        color: #222;
        cursor: pointer;
        transition: background .15s, color .14s;
        position: relative;
        outline: none;
      }
      .note-item.selected, .note-item:focus {
        background: #1976D2;
        color: #fff;
      }

      .note-item.empty {
        text-align: center;
        color: #A8A8A8;
        font-style: italic;
        padding: 1.5em 0;
      }

      .title-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5em;
      }

      .note-title {
        font-weight: 600;
        color: inherit;
        font-size: 1.03em;
        white-space: pre-line;
      }

      .note-actions {
        display: inline-flex;
        gap: 0.1em;
      }

      .icon-btn {
        background: none;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 3px 3px;
        border-radius: 3px;
        line-height: 0;
        color: #1976D2;
        transition: background .13s;
      }
      .icon-btn:hover {
        background: #EFF6FF;
      }

      .note-item.selected .icon-btn,
      .note-item:focus .icon-btn {
        color: #FFF;
      }

      .note-snippet {
        margin-top: 0.18em;
        color: #646464;
        font-size: 0.99em;
        line-height: 1.2;
        word-break: break-word;
        opacity: .92;
      }

      .note-item.selected .note-snippet,
      .note-item.selected .note-title {
        color: #FFF;
      }

      @media (max-width: 750px) {
        .notes-list { max-height: 120px; min-height: 60px; }
        .note-item { margin-bottom: 0.17em; }
      }
      `}</style>
    </ul>
  );
}
