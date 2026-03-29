import React, { useState, useMemo, useCallback } from "react";
import { getEntriesByDate } from "../utils/logic";
import "../styles/history.css";

/**
 * Enhanced History Component with Pagination
 * Displays previous entries with categories, sessions, and pagination for performance
 */
function History({ entries, isDarkMode, onDeleteEntry }) {
  // Pagination state - show 30 sessions per page
  const ITEMS_PER_PAGE = 30;
  const [currentPage, setCurrentPage] = useState(1);

  // Group entries by date
  const entriesByDate = useMemo(() => getEntriesByDate(entries), [entries]);
  
  const sortedDates = useMemo(
    () => Object.keys(entriesByDate).sort((a, b) => new Date(b) - new Date(a)),
    [entriesByDate]
  );

  // Flatten and paginate all entries for efficient rendering
  const allEntries = useMemo(() => {
    const flattened = [];
    sortedDates.forEach((date) => {
      entriesByDate[date].forEach((entry) => {
        flattened.push({ ...entry, date });
      });
    });
    return flattened;
  }, [sortedDates, entriesByDate]);

  const totalPages = Math.ceil(allEntries.length / ITEMS_PER_PAGE);
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return allEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [allEntries, currentPage, ITEMS_PER_PAGE]);

  // Group paginated entries by date for display
  const paginatedEntriesByDate = useMemo(() => {
    return paginatedEntries.reduce((acc, entry) => {
      if (!acc[entry.date]) acc[entry.date] = [];
      acc[entry.date].push(entry);
      return acc;
    }, {});
  }, [paginatedEntries]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString + "T00:00:00");
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }, []);

  const isToday = useCallback((dateString) => {
    const today = new Date().toISOString().split("T")[0];
    return dateString === today;
  }, []);

  const getCategoryColor = useCallback((category) => {
    const colors = {
      Study: "#4caf50",
      Work: "#2196f3",
      Fitness: "#ff9800",
      Project: "#9c27b0",
      Other: "#9e9e9e",
    };
    return colors[category] || "#9e9e9e";
  }, []);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top for better UX
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [totalPages]);

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
      
      {/* Pagination Info */}
      {totalPages > 1 && (
        <div className="pagination-info" aria-live="polite" aria-atomic="true">
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
          {Math.min(currentPage * ITEMS_PER_PAGE, allEntries.length)} of {allEntries.length} entries
          (Page {currentPage} of {totalPages})
        </div>
      )}

      <div className="history-list">
        {Object.keys(paginatedEntriesByDate).sort((a, b) => new Date(b) - new Date(a)).map((date) => {
          const dayEntries = paginatedEntriesByDate[date];
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
                    ⏱️{" "}
                    {dayEntries
                      .reduce((sum, e) => sum + (e.totalTime || e.study || 0), 0)
                      .toFixed(1)}
                    h
                  </span>
                  <span className="summary-stat">
                    🎯 Avg{" "}
                    {Math.round(
                      dayEntries.reduce((sum, e) => sum + (e.focusLevel || 0), 0) / dayEntries.length
                    )}
                    /10
                  </span>
                </div>
              </div>

              {/* Sessions for This Day */}
              <ul className="sessions-list">
                {dayEntries.map((entry, idx) => (
                  <li
                    key={entry.sessionId || `${date}-${idx}`}
                    className="history-card session-card"
                    role="article"
                  >
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
                          role="status"
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
                      onClick={() => onDeleteEntry(entry.id)}
                      title="Delete this session"
                      aria-label={`Delete session from ${formatDate(date)}`}
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

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls" role="navigation" aria-label="History pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
            aria-label="Previous page"
          >
            ← Previous
          </button>

          <div className="pagination-dots">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-dot ${currentPage === page ? "active" : ""}`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
            aria-label="Next page"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default History;
