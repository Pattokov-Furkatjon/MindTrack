import EmptyState from '../components/EmptyState';
import MetricCard from '../components/MetricCard';
import {
  buildAnalyticsInsights,
  getCategoryBreakdown,
  getCurrentStreak,
  getFocusBreakdown,
  getSessionTotals,
  getWeeklyTimeline,
} from '../utils/analytics';
import { formatMinutes } from '../utils/formatters';

function AnalyticsPage({ sessions, notes }) {
  const totals = getSessionTotals(sessions);
  const weeklyTimeline = getWeeklyTimeline(sessions);
  const categoryBreakdown = getCategoryBreakdown(sessions);
  const focusBreakdown = getFocusBreakdown(sessions);
  const insights = buildAnalyticsInsights(sessions, notes);
  const peakMinutes = Math.max(...weeklyTimeline.map((day) => day.minutes), 1);
  const categoryPeak = Math.max(...categoryBreakdown.map((item) => item.minutes), 1);
  const focusPeak = Math.max(...focusBreakdown.map((item) => item.count), 1);
  const tagSummary = [...new Set(notes.map((note) => note.tag))].map((tag) => ({
    tag,
    count: notes.filter((note) => note.tag === tag).length,
  }));

  return (
    <div className="page">
      <section className="page__metrics">
        <MetricCard
          label="Average session"
          value={formatMinutes(totals.averageMinutes)}
          detail="Based on every stored session"
        />
        <MetricCard
          label="Average focus"
          value={`${totals.averageFocus}/10`}
          detail="Directly from manual session scoring"
          accent="amber"
        />
        <MetricCard
          label="Active streak"
          value={`${getCurrentStreak(sessions)} days`}
          detail="Consecutive tracked days"
          accent="ink"
        />
        <MetricCard
          label="Knowledge capture"
          value={notes.length}
          detail="Notes stored beside your work"
          accent="sage"
        />
      </section>

      <section className="page__split">
        <article className="surface-card">
          <div className="page__section-header">
            <div>
              <p className="eyebrow">Workload</p>
              <h3>Weekly timeline</h3>
            </div>
          </div>

          {sessions.length === 0 ? (
            <EmptyState
              title="No analytics yet"
              description="Add sessions to see patterns, breakdowns, and trend data."
            />
          ) : (
            <div className="analytics-bars">
              {weeklyTimeline.map((day) => (
                <div key={day.date} className="analytics-bars__row">
                  <span>{day.label}</span>
                  <div className="analytics-bars__track">
                    <div
                      className="analytics-bars__fill"
                      style={{ width: `${(day.minutes / peakMinutes) * 100}%` }}
                    />
                  </div>
                  <strong>{day.minutes}m</strong>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="surface-card">
          <div className="page__section-header">
            <div>
              <p className="eyebrow">Categories</p>
              <h3>Where your time goes</h3>
            </div>
          </div>

          {categoryBreakdown.length === 0 ? (
            <EmptyState
              title="No category data yet"
              description="Categories will populate as soon as you add sessions."
            />
          ) : (
            <div className="analytics-bars">
              {categoryBreakdown.map((item) => (
                <div key={item.name} className="analytics-bars__row">
                  <span>{item.name}</span>
                  <div className="analytics-bars__track">
                    <div
                      className="analytics-bars__fill analytics-bars__fill--amber"
                      style={{ width: `${(item.minutes / categoryPeak) * 100}%` }}
                    />
                  </div>
                  <strong>{formatMinutes(item.minutes)}</strong>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="page__split">
        <article className="surface-card">
          <div className="page__section-header">
            <div>
              <p className="eyebrow">Focus quality</p>
              <h3>Distribution</h3>
            </div>
          </div>

          <div className="analytics-bars">
            {focusBreakdown.map((item) => (
              <div key={item.label} className="analytics-bars__row">
                <span>{item.label}</span>
                <div className="analytics-bars__track">
                  <div
                    className="analytics-bars__fill analytics-bars__fill--ink"
                    style={{ width: `${(item.count / focusPeak) * 100}%` }}
                  />
                </div>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="surface-card">
          <div className="page__section-header">
            <div>
              <p className="eyebrow">Notes by tag</p>
              <h3>Captured context</h3>
            </div>
          </div>

          {tagSummary.length === 0 ? (
            <EmptyState
              title="No tagged notes yet"
              description="Add notes to build a more useful decision trail."
            />
          ) : (
            <div className="pill-cloud">
              {tagSummary.map((tag) => (
                <div key={tag.tag} className="pill-cloud__item">
                  <span>{tag.tag}</span>
                  <strong>{tag.count}</strong>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="surface-card">
        <div className="page__section-header">
          <div>
            <p className="eyebrow">Insights</p>
            <h3>Interpretation layer</h3>
          </div>
        </div>

        <ul className="insight-list">
          {insights.map((insight) => (
            <li key={insight}>{insight}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AnalyticsPage;
