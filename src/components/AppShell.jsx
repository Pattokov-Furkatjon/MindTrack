const PAGE_META = {
  dashboard: {
    title: 'Command center',
    description: 'Track predictable focus, review weekly momentum, and move with intent.',
  },
  sessions: {
    title: 'Sessions',
    description: 'Add, edit, and review every focus block without surprise saves.',
  },
  notes: {
    title: 'Notes',
    description: 'Capture ideas, decisions, and reflections with clean local persistence.',
  },
  analytics: {
    title: 'Analytics',
    description: 'See where your time goes and how your focus quality changes over time.',
  },
};

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'notes', label: 'Notes' },
  { id: 'analytics', label: 'Analytics' },
];

function AppShell({
  activePage,
  children,
  theme,
  onNavigate,
  onToggleTheme,
  summary,
}) {
  const currentPage = PAGE_META[activePage] || PAGE_META.dashboard;

  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <div className="shell__brand">
          <div className="shell__brand-mark">MT</div>
          <div>
            <p className="shell__eyebrow">MindTrack</p>
            <h1>Focus operating system</h1>
          </div>
        </div>

        <nav className="shell__nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`shell__nav-button ${
                activePage === item.id ? 'is-active' : ''
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="shell__summary">
          <div className="shell__summary-item">
            <span>Sessions</span>
            <strong>{summary.sessions}</strong>
          </div>
          <div className="shell__summary-item">
            <span>Notes</span>
            <strong>{summary.notes}</strong>
          </div>
          <div className="shell__summary-item">
            <span>Pinned</span>
            <strong>{summary.pinned}</strong>
          </div>
        </div>
      </aside>

      <div className="shell__main">
        <header className="shell__topbar">
          <div>
            <p className="shell__eyebrow">Workspace</p>
            <h2>{currentPage.title}</h2>
            <p className="shell__description">{currentPage.description}</p>
          </div>

          <div className="shell__actions">
            <button
              type="button"
              className="button button--ghost"
              onClick={onToggleTheme}
            >
              {theme === 'light' ? 'Switch to dark' : 'Switch to light'}
            </button>
          </div>
        </header>

        <main className="shell__content">{children}</main>

        <footer className="shell__footer">
          Data stays in localStorage. No automatic sync, no hidden updates.
        </footer>
      </div>
    </div>
  );
}

export default AppShell;
