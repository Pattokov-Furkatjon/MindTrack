import { useDeferredValue, useState } from 'react';
import SessionForm from '../components/SessionForm';
import SessionList from '../components/SessionList';
import SessionTimer from '../components/SessionTimer';

function SessionsPage({
  sessions,
  onCreateSession,
  onUpdateSession,
  onDeleteSession,
}) {
  const [editingSession, setEditingSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [timerMinutes, setTimerMinutes] = useState(null);
  const deferredSearch = useDeferredValue(searchTerm);
  const categories = ['All', ...new Set(sessions.map((session) => session.category))];

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(deferredSearch.toLowerCase()) ||
      session.notes.toLowerCase().includes(deferredSearch.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || session.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (sessionValues) => {
    if (editingSession) {
      onUpdateSession(editingSession.id, sessionValues);
      setEditingSession(null);
    } else {
      onCreateSession(sessionValues);
    }

    setTimerMinutes(null);
  };

  const handleDelete = (sessionId) => {
    if (!window.confirm('Delete this session?')) {
      return;
    }

    if (editingSession?.id === sessionId) {
      setEditingSession(null);
    }

    onDeleteSession(sessionId);
  };

  return (
    <div className="page page--two-column">
      <div className="page__rail">
        <SessionForm
          editingSession={editingSession}
          timerMinutes={timerMinutes}
          onSubmit={handleSubmit}
          onCancel={() => setEditingSession(null)}
        />
        <SessionTimer onApplyDuration={setTimerMinutes} />
      </div>

      <SessionList
        sessions={filteredSessions}
        categories={categories}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
        onEdit={setEditingSession}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default SessionsPage;
