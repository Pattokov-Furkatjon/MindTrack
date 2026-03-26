import React from "react";
import { getEntriesByDate } from "../utils/logic";
import "../styles/history.css";

/**
 * Enhanced History Component
 * Displays previous entries with categories, sessions, and all new metrics
 */
function History({ entries, isDarkMode, onDeleteEntry }) {
  // Group entries by date
  const entriesByDate = getEntriesByDate(entries);
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split("T")[0];
    return dateString === today;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Study: "#4caf50",
      Work: "#2196f3",
      Fitness: "#ff9800",
      Project: "#9c27b0",
      Other: "#9e9e9e",
    };
    return colors[category] || "#9e9e9e";
  };

  if (entries.length === 0) {
    return (
      <div className={`history-container ${isDarkMode ? "history-dark" : ""}`}>
        <h2 className="history-title">📜 History</h2>
        <div className="empty-message">
          <div className="empty-icon">📭</div>
          <p>No entries yet. Start by filling today's form! 🚀</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`history-container ${isDarkMode ? "history-dark" : ""}`}>
      <h2 className="history-title">📜 Entry History</h2>
      <div className="history-list">
        {sortedDates.map((date) => {
          const dayEntries = entriesByDate[date];
          return (
            <div key={date} className="history-day-group">
              {/* Day Header with Session Count */}
              <div className="day-header">
                <div className="day-info">
                  <h3 className="day-title">
                    {formatDate(date)} {isToday(date) ? "(Today)" : ""}
                  </h3>
                  <span className="session-count">
                    {dayEntries.length} {dayEntries.length === 1 ? "session" : "sessions"}
                  </span>
                </div>
                {/* Day Summary Stats */}
                <div className="day-summary">
                  <span className="summary-stat">
                    ⏱️ {dayEntries.reduce((sum, e) => sum + (e.totalTime || e.study || 0), 0).toFixed(1)}h
                  </span>
                  <span className="summary-stat">
                    🎯 Avg {Math.round(dayEntries.reduce((sum, e) => sum + (e.focusLevel || 0), 0) / dayEntries.length)}/10
                  </span>
                </div>
              </div>

              {/* Sessions for This Day */}
              <ul className="sessions-list">
                {dayEntries.map((entry, idx) => (
                  <li key={entry.sessionId || `${date}-${idx}`} className="history-card session-card">
                    {/* Session Number and Category Badge */}
                    <div className="session-header">
                      <span className="session-number">Session {idx + 1}</span>
                      {entry.category && (
                        <span
                          className="category-badge"
                          style={{
                            backgroundColor: getCategoryColor(entry.category),
                            color: "#ffffff",
                          }}
                        >
                          🏷️ {entry.category}
                        </span>
                      )}
                    </div>

                    <div className="card-content">
                      {/* Main Stats */}
                      <div className="card-stat">
                        <span className="stat-label">⏱️ Total Time</span>
                        <span className="stat-value">{entry.totalTime || entry.study || 0}h</span>
                      </div>

                      {entry.focusLevel && (
                        <div className="card-stat">
                          <span className="stat-label">🎯 Focus</span>
                          <span className="stat-value">{entry.focusLevel}/10</span>
                        </div>
                      )}

                      {entry.exercise > 0 && (
                        <div className="card-stat">
                          <span className="stat-label">💪 Exercise</span>
                          <span className="stat-value">{entry.exercise}h</span>
                        </div>
                      )}

                      {entry.startTime && entry.endTime && (
                        <div className="card-stat">
                          <span className="stat-label">⏰ Time Range</span>
                          <span className="stat-value time-range">
                            {entry.startTime} - {entry.endTime}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Goal */}
                    {entry.goal && (
                      <div className="card-goal">
                        <div className="goal-label">🎯 Goal</div>
                        <p className="goal-text">{entry.goal}</p>
                      </div>
                    )}

                    {/* Distraction */}
                    {entry.distraction && (
                      <div className="card-distraction">
                        <div className="distraction-label">🚫 Distraction</div>
                        <p className="distraction-text">{entry.distraction}</p>
                      </div>
                    )}

                    {/* Notes */}
                    {entry.notes && (
                      <div className="card-notes">
                        <div className="notes-label">📝 Notes</div>
                        <p className="notes-text">{entry.notes}</p>
                      </div>
                    )}

                    <button
                      className="card-delete-btn"
                      onClick={() => onDeleteEntry(entry.sessionId)}
                      title="Delete this session"
                    >
                      🗑️ Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default History;
