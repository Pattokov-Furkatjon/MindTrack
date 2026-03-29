import React, { useState, useEffect } from 'react';
import Spinner from './Spinner';

function Analytics({ addNotification }) {
  const [stats, setStats] = useState({
    totalMinutes: 0,
    averageSessionLength: 0,
    mostActiveDay: '',
    weeklyTrend: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAnalytics();
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [addNotification]);

  const loadAnalytics = () => {
    try {
      const data = JSON.parse(localStorage.getItem('mindtrack_data') || '{}');
      const sessions = data.sessions || [];

      if (sessions.length === 0) {
        setStats({
          totalMinutes: 0,
          averageSessionLength: 0,
          mostActiveDay: 'N/A',
          weeklyTrend: [],
        });
        addNotification?.('No data yet for analytics', 'warning');
        return;
      }

    const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalMinutes = Math.round(totalSeconds / 60);
    const averageSessionLength = Math.round(totalMinutes / sessions.length);

    // Calculate most active day
    const dayStats = {};
    sessions.forEach(s => {
      const date = new Date(s.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      dayStats[day] = (dayStats[day] || 0) + (s.duration || 0);
    });

    const mostActiveDay = Object.entries(dayStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Weekly trend
    const weeklyData = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      const dayTotal = sessions
        .filter(s => new Date(s.date).toLocaleDateString() === dateStr)
        .reduce((sum, s) => sum + (s.duration || 0), 0);
      weeklyData[date.toLocaleDateString('en-US', { weekday: 'short' })] = Math.round(dayTotal / 60);
    }

    setStats({
      totalMinutes,
      averageSessionLength,
      mostActiveDay,
      weeklyTrend: Object.entries(weeklyData).map(([day, minutes]) => ({ day, minutes })),
    });
    addNotification?.('Analytics loaded', 'success');
  } catch (error) {
    console.error('Analytics error:', error);
    addNotification?.('Unable to load analytics', 'error');
    setStats({
      totalMinutes: 0,
      averageSessionLength: 0,
      mostActiveDay: 'N/A',
      weeklyTrend: [],
    });
  }
};

  const maxMinutes = Math.max(...stats.weeklyTrend.map((d) => d.minutes), 1);

  if (loading) {
    return (
      <div>
        <h1 style={{ marginBottom: '1.5rem' }}>Analytics</h1>
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Analytics</h1>

      <div className='grid' style={{ marginBottom: '2rem' }}>
        <div className='card'>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⏱️</div>
          <div className='card-title'>Total Minutes</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {stats.totalMinutes}
          </div>
        </div>

        <div className='card'>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
          <div className='card-title'>Avg Session</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {stats.averageSessionLength}m
          </div>
        </div>

        <div className='card'>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔥</div>
          <div className='card-title'>Most Active</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
            {stats.mostActiveDay}
          </div>
        </div>
      </div>

      <div className='card'>
        <div className='card-title'>Weekly Trend</div>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '1rem',
          height: '200px',
          marginTop: '2rem',
        }}>
          {stats.weeklyTrend.map((data) => (
            <div key={data.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                height: `${maxMinutes > 0 ? (data.minutes / maxMinutes) * 150 : 0}px`,
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                borderRadius: '8px 8px 0 0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                minHeight: '4px',
              }} title={`${data.minutes}m`} />
              <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                {data.day}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {data.minutes}m
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='card' style={{ marginTop: '2rem' }}>
        <div className='card-title'>Insights</div>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: '2' }}>
          <li>✓ Keep sessions under 60 minutes for better focus</li>
          <li>✓ Try to maintain consistent daily streaks</li>
          <li>✓ Review your most productive times</li>
          <li>✓ Take 5-10 minute breaks between sessions</li>
        </ul>
      </div>
    </div>
  );
}

export default Analytics;
