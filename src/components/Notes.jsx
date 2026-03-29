import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

function Notes({ addNotification }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNotes();
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [addNotification]);

  const loadNotes = () => {
    try {
      const data = JSON.parse(localStorage.getItem('mindtrack_data') || '{}');
      setNotes(data.notes || []);
    } catch (error) {
      console.error('Notes load error:', error);
      addNotification?.('Unable to load notes', 'error');
      setNotes([]);
    }
  };

  const addNote = () => {
    if (!title.trim() || !content.trim()) {
      addNotification?.('Please fill title and content to add a note', 'error');
      return;
    }

    const newNote = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString(),
      pinned: false,
    };

    const data = JSON.parse(localStorage.getItem('mindtrack_data') || '{}');
    data.notes = [...(data.notes || []), newNote];
    localStorage.setItem('mindtrack_data', JSON.stringify(data));

    setNotes((prev) => [...prev, newNote]);
    setTitle('');
    setContent('');
    addNotification?.('Note added', 'success');
  };

  const deleteNote = (id) => {
    const updated = notes.filter((n) => n.id !== id);
    const data = JSON.parse(localStorage.getItem('mindtrack_data') || '{}');
    data.notes = updated;
    localStorage.setItem('mindtrack_data', JSON.stringify(data));
    setNotes(updated);
    addNotification?.('Note deleted', 'success');
  };

  const togglePin = (id) => {
    const updated = notes.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
    const data = JSON.parse(localStorage.getItem('mindtrack_data') || '{}');
    data.notes = updated;
    localStorage.setItem('mindtrack_data', JSON.stringify(data));
    setNotes(updated);
    addNotification?.('Note pin status updated', 'success');
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const regularNotes = filteredNotes.filter(n => !n.pinned);

  if (loading) {
    return (
      <div>
        <h1 style={{ marginBottom: '1.5rem' }}>Notes</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Notes</h1>

      <div className='card' style={{ marginBottom: '2rem' }}>
        <div className='card-title'>Create a New Note</div>
        <input
          type='text'
          placeholder='Note title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: '1rem' }}
        />
        <textarea
          placeholder='Write your note here...'
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ marginBottom: '1rem', minHeight: '120px', resize: 'vertical' }}
        />
        <button onClick={addNote} className='btn btn-primary'>
          + Add Note
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <input
          type='text'
          placeholder='Search notes...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '300px' }}
        />
      </div>

      {pinnedNotes.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '1rem', color: 'var(--warning)' }}>📌 Pinned</h2>
          <div className='grid' style={{ marginBottom: '2rem' }}>
            {pinnedNotes.map(note => (
              <div key={note.id} className='card' style={{ borderLeft: '4px solid var(--warning)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                      {note.title}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>
                      {note.content.substring(0, 150)}...
                    </p>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(note.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => togglePin(note.id)} 
                      className='btn'
                      style={{ color: 'var(--warning)' }}
                    >
                      📌
                    </button>
                    <button 
                      onClick={() => deleteNote(note.id)} 
                      className='btn'
                      style={{ color: 'var(--danger)' }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: '1rem' }}>📝 All Notes</h2>
      <div className='grid'>
        {regularNotes.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', gridColumn: '1/-1' }}>
            No notes yet. Create one above!
          </p>
        ) : (
          regularNotes.map(note => (
            <div key={note.id} className='card'>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {note.title}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', whiteSpace: 'pre-wrap' }}>
                    {note.content.substring(0, 150)}...
                  </p>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    {new Date(note.date).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => togglePin(note.id)} 
                    className='btn'
                  >
                    📌
                  </button>
                  <button 
                    onClick={() => deleteNote(note.id)} 
                    className='btn'
                    style={{ color: 'var(--danger)' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Notes;
