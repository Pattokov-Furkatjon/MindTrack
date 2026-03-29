import MetricCard from '../components/MetricCard';
import EmptyState from '../components/EmptyState';
import { getDashboardStats } from '../utils/analytics';
import { formatLongDate, formatMinutes, formatShortDate } from '../utils/formatters';

function DashboardPage({ state, onNavigate }) {
  const stats = getDashboardStats(state);
  const peakMinutes = Math.max(...stats.weeklyTimeline.map((day) => day.minutes), 1);

  return (
    <div className="page">
      <section className="surface-card page__hero">
        <div>
          <p className="eyebrow">Overview</p>
          <h3>Build calm execution with fewer surprises.</h3>
          <p className="page__hero-copy">
            Sessions, notes, and analytics now update from direct user actions only.
            Use the dashboard to spot momentum and decide your next move.
          </p>
        </div>

        <div className="page__hero-actions">
          <button
            type="button"
            className="button button--primary"
            onClick={() => onNavigate('sessions')}
          >
            Add a session
          </button>
          <button
            type="button"
            className="button button--secondary"
            onClick={() => onNavigate('notes')}
          >
            Capture a note
          </button>
        </div>
      </section>

      <section className="page__metrics">
        <MetricCard
          label="Total focus time"
          value={formatMinutes(stats.totalMinutes)}
          detail={`${stats.totalSessions} sessions tracked`}
        />
        <MetricCard
          label="Today"
          value={formatMinutes(stats.todayMinutes)}
          detail={`${stats.todaySessions} sessions added today`}
          accent="amber"
        />
        <MetricCard
          label="Current streak"
          value={`${stats.streak} days`}
          detail="Based on active session dates"
          accent="ink"
        />
        <MetricCard
          label="Pinned notes"
          value={stats.pinnedNotes}
          detail={`${stats.notesCount} notes in your workspace`}
          accent="sage"
        />
      </section>

      <section className="page__split">
        <article className="surface-card">
          <div className="page__section-header">
            <div>
              <p className="eyebrow">Weekly momentum</p>
              <h3>Last 7 days</h3>
            </div>
          </div>

          <div className="mini-bars">
            {stats.weeklyTimeline.map((day) => (
              <div key={day.date} className="mini-bars__column">
                <div className="mini-bars__value">{day.minutes}m</div>
                <div className="mini-bars__track">
                  <div
                    className="mini-bars__fill"
                    style={{ height: `${(day.minutes / peakMinutes) * 100}%` }}
                  />
                </div>
                <div className="mini-bars__label">{day.label}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card">
          <div className="page__section-header">
            <div>
              <p className="eyebrow">Today snapshot</p>
              <h3>At a glance</h3>
            </div>
          </div>

          <div className="snapshot-list">
            <div className="snapshot-list__item">
              <span>Average focus</span>
              <strong>{stats.averageFocus}/10</strong>
            </div>
            <div className="snapshot-list__item">
              <span>Longest block</span>
              <strong>{formatMinutes(stats.longestSessionMinutes)}</strong>
            </div>
            <div className="snapshot-list__item">
              <span>Most recent day</span>
              <strong>
                {stats.recentSessions[0]
                  ? formatLongDate(stats.recentSessions[0].date)
                  : 'No activity yet'}
              </strong>
            </div>
          </div>
        </article>
      </section>

      <section className="page__split">
        <article className="surface-card">
          <div className="page__section-header">
            <div>
              <p className="eyebrow">Recent sessions</p>
              <h3>Latest focus blocks</h3>
            </div>
          </div>

          {stats.recentSessions.length === 0 ? (
            <EmptyState
              title="No sessions yet"
              description="Head to Sessions to add a tracked block."
              actionLabel="Open Sessions"
              onAction={() => onNavigate('sessions')}
            />
          ) : (
            <div className="stack-list">
              {stats.recentSessions.map((session) => (
                <article key={session.id} className="entry-card entry-card--compact">
                  <div className="entry-card__header">
                    <div>
                      <h4>{session.title}</h4>
                      <p className="muted">{formatShortDate(session.date)}</p>
                    </div>
                    <span className="tag-pill">{session.category}</span>
                  </div>
                  <div className="entry-card__meta">
                    <span>{formatMinutes(session.durationMinutes)}</span>
                    <span>Focus {session.focusScore}/10</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>

        <article className="surface-card">
          <div className="page__section-header">
            <div>
              <p className="eyebrow">Recent notes</p>
              <h3>Latest written context</h3>
            </div>
          </div>

          {stats.recentNotes.length === 0 ? (
            <EmptyState
              title="No notes yet"
              description="Capture context so your sessions become reusable knowledge."
              actionLabel="Open Notes"
              onAction={() => onNavigate('notes')}
            />
          ) : (
            <div className="stack-list">
              {stats.recentNotes.map((note) => (
                <article key={note.id} className="entry-card entry-card--compact">
                  <div className="entry-card__header">
                    <div>
                      <h4>{note.title}</h4>
                      <p className="muted">{note.pinned ? 'Pinned note' : note.tag}</p>
                    </div>
                    <span className="tag-pill">{note.tag}</span>
                  </div>
                  <p className="entry-card__body clamp-3">{note.content}</p>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}

export default DashboardPage;
