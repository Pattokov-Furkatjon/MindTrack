import React, { memo } from "react";
import "../styles/session-card.css";

/**
 * SessionCard Component
 * Displays individual session with details
 * Memoized to prevent unnecessary re-renders
 */
function SessionCard({ session, isDarkMode, onDelete }) {
  const getSessionIcon = () => {
    switch (session.type) {
      case "study":
        return "📚";
      case "work":
        return "💼";
      case "exercise":
        return "💪";
      default:
        return "⏱️";
    }
  };

  const getSessionLabel = () => {
    const labels = {
      study: "Study Session",
      work: "Work Session",
      exercise: "Exercise Session",
    };
    return labels[session.type] || "Session";
  };

  const getSessionColor = () => {
    const colors = {
      study: "#4caf50",
      work: "#2196f3",
      exercise: "#ff9800",
    };
    return colors[session.type] || "#999";
  };

  const formatDuration = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    if (m === 0) return `${h}h`;
    if (h === 0) return `${m}m`;
    return `${h}h ${m}m`;
  };

  return (
    <div className={`session-card ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Card Header */}
      <div className="card-header">
        <div className="session-type-badge" style={{ backgroundColor: getSessionColor() }}>
          {getSessionIcon()}
        </div>
        <div className="card-title-section">
          <h4 className="card-title">{getSessionLabel()}</h4>
          <p className="card-time">
            {session.startTime} → {session.endTime}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        <div className="duration-section">
          <div className="duration-value">{formatDuration(session.duration)}</div>
          <div className="duration-label">Duration</div>
        </div>

        {/* Session Details */}
        <div className="session-details">
          <div className="detail-item">
            <span className="detail-icon">🕐</span>
            <span className="detail-text">Start: {session.startTime}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">🕑</span>
            <span className="detail-text">End: {session.endTime}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">😊</span>
            <span className="detail-text">Mood: {session.mood || 0}/10</span>
          </div>
          {session.notes && (
            <div className="detail-item">
              <span className="detail-icon">📝</span>
              <span className="detail-text">{session.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      {onDelete && (
        <div className="card-footer">
          <button
            className="btn-delete"
            onClick={() => onDelete(session.id)}
            title="Delete this session"
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(SessionCard);
