import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

function Sessions({ addNotification }) {
  const [sessions, setSessions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadSessions();
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [addNotification]);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setSessionTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const loadSessions = () => {
    try {
      const data = JSON.parse(localStorage.getItem('mindtrack_data') || '{}');
      setSessions(data.sessions || []);
    } catch (error) {
      console.error('Sessions load error:', error);
      addNotification?.('Unable to load sessions', 'error');
      setSessions([]);
    }
  };

  const startSession = () => {
    if (!subject.trim()) {
      addNotification?.('Please enter a session subject before starting', 'error');
      return;
    }
    if (isRecording) {
      addNotification?.('Already recording a session', 'warning');
      return;
    }
    setIsRecording(true);
    setSessionTime(0);
    addNotification?.('Session started', 'success');
  };

  const stopSession = () => {
    if (!isRecording) {
      addNotification?.('No active session to stop', 'error');
      return;
    }

    setIsRecording(false);
    if (sessionTime > 0) {
      const newSession = {
        id: Date.now(),
        subject,
        duration: sessionTime,
        date: new Date().toISOString(),
      };
      const data = JSON.parse(localStorage.getItem('mindtrack_data') || '{}');
      data.sessions = [...(data.sessions || []), newSession];
      localStorage.setItem('mindtrack_data', JSON.stringify(data));

      setSessions((prev) => [...prev, newSession]);
      setSubject('');
      setSessionTime(0);
      addNotification?.('Session stopped and saved', 'success');
    } else {
      addNotification?.('Session length was too short to save', 'error');
    }
  };

  const deleteSession = (id) => {
    const updated = sessions.filter((s) => s.id !== id);
    const data = JSON.parse(localStorage.getItem('mindtrack_data') || '{}');
    data.sessions = updated;
    localStorage.setItem('mindtrack_data', JSON.stringify(data));
    setSessions(updated);
    addNotification?.('Session deleted', 'success');
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}h ${mins}m ${secs}s`;
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ marginBottom: '1.5rem' }}>Session Tracker</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Session Tracker</h1>

      <div className='card' style={{ marginBottom: '2rem' }}>
        <div className='card-title'>Start a New Session</div>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <input
            type='text'
            placeholder='What are you focusing on?'
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ flex: 1 }}
            disabled={isRecording}
          />
          <button
            onClick={isRecording ? stopSession : startSession}
            className='btn btn-primary'
            style={{
              background: isRecording 
                ? 'linear-gradient(135deg, var(--danger), #ff6b6b)' 
                : 'linear-gradient(135deg, var(--primary), var(--secondary))',
            }}
          >
            {isRecording ? '⏹ Stop' : '▶ Start'}
          </button>
        </div>
        
        {isRecording && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>
              {formatTime(sessionTime)}
            </div>
            <div style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Recording: {subject}
            </div>
          </div>
        )}
      </div>

      <h2 style={{ marginBottom: '1rem' }}>Recent Sessions</h2>
      <div className='grid'>
        {sessions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', gridColumn: '1/-1' }}>
            No sessions yet. Start one above!
          </p>
        ) : (
          sessions.slice().reverse().map(session => (
            <div key={session.id} className='card'>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {session.subject}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {formatTime(session.duration)}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    {new Date(session.date).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => deleteSession(session.id)}
                  className='btn'
                  style={{ color: 'var(--danger)' }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Sessions;
