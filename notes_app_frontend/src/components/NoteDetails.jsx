import React from "react";

/**
 * NoteDetails.jsx
 * Props:
 * - note: {id, title, body}
 * - onEdit: fn() => void
 * - onDelete: fn() => void
 */
export default function NoteDetails({ note, onEdit, onDelete }) {
  if (!note) return <div>No note selected.</div>;
  return (
    <div className="note-details">
      <div className="note-action-row">
        <button className="accent-btn" onClick={onEdit} title="Edit note">Edit</button>
        <button className="delete-btn" onClick={onDelete} title="Delete note">Delete</button>
      </div>
      <h2 className="note-title">{note.title}</h2>
      <div className="note-body">{note.body?.split('\n').map((p, i) => <p key={i}>{p}</p>)}</div>
      <style>{`
      .note-details {
        background: #fcfcfc;
        border-radius: 8px;
        box-shadow: 0 3px 22px rgba(197, 197, 197, 0.06);
        border: 1px solid #e5eaf1;
        padding: 1.5rem 1.7rem;
        min-width: 0;
        max-width: 640px;
      }

      .note-action-row {
        display: flex;
        gap: 1.1em;
        justify-content: flex-end;
        margin-bottom: 1.3em;
      }

      .note-title {
        font-size: 1.39em;
        font-weight: 700;
        color: #1976D2;
        margin: 0 0 1.2em 0;
      }

      .accent-btn {
        background: #FFC107;
        color: #424242;
        border: 1.5px solid #FFC107;
        border-radius: 5px;
        font-weight: 600;
        padding: 0.31em 1.25em;
        cursor: pointer;
        margin-left: 0.38em;
        transition: background .10s, color .13s;
      }
      .accent-btn:hover {
        background: #ffe082;
        color: #1976D2;
      }

      .delete-btn {
        background: #fff;
        color: #ff4141;
        border: 1.5px solid #ff4141;
        border-radius: 5px;
        font-weight: 500;
        padding: 0.31em 1.25em;
        cursor: pointer;
        margin-left: 0.4em;
        transition: background .08s, color .14s;
      }
      .delete-btn:hover {
        background: #ffe7e7;
        color: #b91111;
      }

      .note-body {
        font-size: 1.04em;
        color: #252525;
        line-height: 1.75;
        margin-bottom: 0;
        word-break: break-word;
      }
      .note-body p { margin: 0 0 0.8em 0;}
      `}</style>
    </div>
  );
}
