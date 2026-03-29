import EmptyState from './EmptyState';
import { formatTimestamp } from '../utils/formatters';

function NotesGrid({
  notes,
  tags,
  searchTerm,
  selectedTag,
  onSearchChange,
  onTagChange,
  onEdit,
  onDelete,
  onTogglePin,
}) {
  return (
    <section className="surface-card">
      <div className="page__section-header">
        <div>
          <p className="eyebrow">Library</p>
          <h3>Notes collection</h3>
        </div>
        <span className="status-pill">{notes.length} matching</span>
      </div>

      <div className="toolbar">
        <input
          type="search"
          className="toolbar__search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search titles or content"
        />

        <select
          className="toolbar__select"
          value={selectedTag}
          onChange={(event) => onTagChange(event.target.value)}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {notes.length === 0 ? (
        <EmptyState
          title="No matching notes"
          description="Create a note to store context beside your tracked sessions."
        />
      ) : (
        <div className="note-grid">
          {notes.map((note) => (
            <article key={note.id} className={`entry-card note-card ${note.pinned ? 'is-pinned' : ''}`}>
              <div className="entry-card__header">
                <div>
                  <h4>{note.title}</h4>
                  <p className="muted">Updated {formatTimestamp(note.updatedAt)}</p>
                </div>
                <span className="tag-pill">{note.tag}</span>
              </div>

              <p className="entry-card__body">{note.content}</p>

              <div className="note-card__footer">
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => onTogglePin(note.id)}
                >
                  {note.pinned ? 'Unpin' : 'Pin'}
                </button>
                <button
                  type="button"
                  className="button button--ghost"
                  onClick={() => onEdit(note)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="button button--danger"
                  onClick={() => onDelete(note.id)}
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

export default NotesGrid;
