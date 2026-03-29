import EmptyState from './EmptyState';
import { formatLongDate, formatMinutes } from '../utils/formatters';

function SessionList({
  sessions,
  categories,
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onEdit,
  onDelete,
}) {
  return (
    <section className="surface-card">
      <div className="page__section-header">
        <div>
          <p className="eyebrow">Library</p>
          <h3>Session history</h3>
        </div>
        <span className="status-pill">{sessions.length} matching</span>
      </div>

      <div className="toolbar">
        <input
          type="search"
          className="toolbar__search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search titles or notes"
        />

        <select
          className="toolbar__select"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          title="No matching sessions"
          description="Start with a manual entry or apply tracked time from the timer."
        />
      ) : (
        <div className="stack-list">
          {sessions.map((session) => (
            <article key={session.id} className="entry-card">
              <div className="entry-card__header">
                <div>
                  <h4>{session.title}</h4>
                  <p className="muted">{formatLongDate(session.date)}</p>
                </div>
                <span className="tag-pill">{session.category}</span>
              </div>

              <div className="entry-card__meta">
                <span>{formatMinutes(session.durationMinutes)}</span>
                <span>Focus {session.focusScore}/10</span>
              </div>

              <p className="entry-card__body">
                {session.notes || 'No session notes were added for this block.'}
              </p>

              <div className="card-actions">
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => onEdit(session)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="button button--danger"
                  onClick={() => onDelete(session.id)}
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default SessionList;
