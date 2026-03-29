import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

function Dashboard({ addNotification }) {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalHours: 0,
    todayFocus: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);

  const calculateStreak = (sessions) => {
    if (sessions.length === 0) return 0;
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const sessionsByDate = {};
    sessions.forEach((s) => {
      const date = new Date(s.date).toDateString();
      sessionsByDate[date] = true;
    });

    while (sessionsByDate[currentDate.toDateString()]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    return streak;
  };

  const loadStats = () => {
    try {
      const data = JSON.parse(localStorage.getItem('mindtrack_data') || '{}');
      const sessions = data.sessions || [];

      const today = new Date().toDateString();
      const todaySessions = sessions.filter((s) => new Date(s.date).toDateString() === today);
      const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

      setStats({
        totalSessions: sessions.length,
        totalHours: Math.round(totalMinutes / 60),
        todayFocus: todaySessions.length,
        streak: calculateStreak(sessions),
      });
      addNotification?.('Dashboard data refreshed', 'success');
    } catch (error) {
      console.error('Dashboard error:', error);
      addNotification?.('Unable to load dashboard data', 'error');
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadStats();
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [addNotification]);

  if (loading) {
    return (
      <div>
        <h1 style={{ marginBottom: '1.5rem' }}>Dashboard</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>
      
      <div className='grid'>
        <div className='card'>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎯</div>
          <div className='card-title'>Total Sessions</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {stats.totalSessions}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            All-time sessions
          </div>
        </div>

        <div className='card'>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏱️</div>
          <div className='card-title'>Total Hours</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {stats.totalHours}h
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Time focused
          </div>
        </div>

        <div className='card'>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📈</div>
          <div className='card-title'>Today</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {stats.todayFocus}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Sessions today
          </div>
        </div>

        <div className='card'>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔥</div>
          <div className='card-title'>Streak</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {stats.streak}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Days in a row
          </div>
        </div>
      </div>

      <div className='card' style={{ marginTop: '2rem' }}>
        <div className='card-title'>Quick Start</div>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Start tracking your productivity by creating a new session in the Sessions tab.
        </p>
        <button 
           onClick={() => window.scrollTo(0, 0)} 
           style={{ color: 'var(--primary)', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Go to Sessions →
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
