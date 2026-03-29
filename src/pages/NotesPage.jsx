import { useDeferredValue, useState } from 'react';
import NoteForm from '../components/NoteForm';
import NotesGrid from '../components/NotesGrid';

function NotesPage({
  notes,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  onToggleNotePin,
}) {
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const deferredSearch = useDeferredValue(searchTerm);
  const tags = ['All', ...new Set(notes.map((note) => note.tag))];

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        note.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        note.content.toLowerCase().includes(deferredSearch.toLowerCase());
      const matchesTag = selectedTag === 'All' || note.tag === selectedTag;

      return matchesSearch && matchesTag;
    })
    .sort((left, right) => {
      if (left.pinned !== right.pinned) {
        return Number(right.pinned) - Number(left.pinned);
      }

      return new Date(right.updatedAt) - new Date(left.updatedAt);
    });

  const handleSubmit = (noteValues) => {
    if (editingNote) {
      onUpdateNote(editingNote.id, noteValues);
      setEditingNote(null);
      return;
    }

    onCreateNote(noteValues);
  };

  const handleDelete = (noteId) => {
    if (!window.confirm('Delete this note?')) {
      return;
    }

    if (editingNote?.id === noteId) {
      setEditingNote(null);
    }

    onDeleteNote(noteId);
  };

  return (
    <div className="page page--two-column">
      <div className="page__rail">
        <NoteForm
          editingNote={editingNote}
          onSubmit={handleSubmit}
          onCancel={() => setEditingNote(null)}
        />
      </div>

      <NotesGrid
        notes={filteredNotes}
        tags={tags}
        searchTerm={searchTerm}
        selectedTag={selectedTag}
        onSearchChange={setSearchTerm}
        onTagChange={setSelectedTag}
        onEdit={setEditingNote}
        onDelete={handleDelete}
        onTogglePin={(noteId) => {
          onToggleNotePin(noteId);

          if (editingNote?.id === noteId) {
            setEditingNote((currentNote) =>
              currentNote ? { ...currentNote, pinned: !currentNote.pinned } : null,
            );
          }
        }}
      />
    </div>
  );
}

export default NotesPage;
