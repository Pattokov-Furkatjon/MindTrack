import { getSessionTotals } from '../utils/analytics';
import { formatMinutes } from '../utils/formatters';

function LandingView({ sessions, notes, onEnter }) {
  const totals = getSessionTotals(sessions);

  return (
    <div className="landing">
      <div className="landing__glow landing__glow--left" aria-hidden="true" />
      <div className="landing__glow landing__glow--right" aria-hidden="true" />

      <section className="landing__hero surface-card">
        <div className="landing__copy">
          <p className="eyebrow">MindTrack</p>
          <h1>Make focus visible, editable, and fully under your control.</h1>
          <p className="landing__lede">
            MindTrack is now rebuilt as a clean local-first dashboard for sessions,
            notes, and analytics. Nothing mutates unless you click it.
          </p>

          <div className="landing__actions">
            <button type="button" className="button button--primary" onClick={onEnter}>
              Enter workspace
            </button>
          </div>
        </div>

        <div className="landing__panel">
          <div className="landing__stats">
            <div>
              <span>Total sessions</span>
              <strong>{totals.totalSessions}</strong>
            </div>
            <div>
              <span>Tracked time</span>
              <strong>{formatMinutes(totals.totalMinutes)}</strong>
            </div>
            <div>
              <span>Saved notes</span>
              <strong>{notes.length}</strong>
            </div>
          </div>

          <div className="landing__feature-list">
            <article>
              <h2>Deliberate actions</h2>
              <p>Sessions and notes save only on explicit user actions.</p>
            </article>
            <article>
              <h2>Sharper structure</h2>
              <p>Pages, hooks, utilities, and reusable UI are separated cleanly.</p>
            </article>
            <article>
              <h2>Real dashboard polish</h2>
              <p>Responsive layouts, modern spacing, and lightweight motion throughout.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingView;
