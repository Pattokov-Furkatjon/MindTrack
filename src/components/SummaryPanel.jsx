import React from "react";
import {
  calculateSessionTotals,
  calculateProductivityScore,
  calculateWeeklyStats,
  formatTime,
} from "../utils/logic";
import "../styles/summary-panel.css";

/**
 * SummaryPanel Component
 * Displays daily and weekly statistics
 */
function SummaryPanel({ todayEntry, allEntries, isDarkMode }) {
  // Calculate today's totals
  const todayTotals = todayEntry
    ? calculateSessionTotals(todayEntry.sessions)
    : {
        totalStudy: 0,
        totalWork: 0,
        totalExercise: 0,
        totalTime: 0,
        sessionCount: 0,
        averageSessionDuration: 0,
      };

  // Calculate today's score
  const todayScore = calculateProductivityScore(
    todayTotals.totalStudy,
    todayTotals.totalWork,
    todayTotals.totalExercise,
    todayTotals.sessionCount
  );

  // Calculate weekly stats
  const weeklyStats = calculateWeeklyStats(allEntries);

  const getScoreColor = (score) => {
    if (score >= 80) return "#4caf50"; // green
    if (score >= 60) return "#ffb74d"; // orange
    if (score >= 40) return "#ff9800"; // dark orange
    return "#ff6b6b"; // red
  };

  const getScoreLabel = (score) => {
    if (score >= 90) return "🔥 Exceptional";
    if (score >= 80) return "⭐ Excellent";
    if (score >= 70) return "👍 Great";
    if (score >= 60) return "📈 Good";
    if (score >= 50) return "👌 Decent";
    if (score >= 30) return "⚠️ Fair";
    return "💪 Getting Started";
  };

  return (
    <div className={`summary-panel ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Today's Summary */}
      <div className="summary-section today-summary">
        <h3 className="section-title">📊 Today's Summary</h3>

        <div className="stats-grid">
          {/* Study Time */}
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-value">{formatTime(todayTotals.totalStudy)}</div>
            <div className="stat-label">Study</div>
          </div>

          {/* Work Time */}
          <div className="stat-card">
            <div className="stat-icon">💼</div>
            <div className="stat-value">{formatTime(todayTotals.totalWork)}</div>
            <div className="stat-label">Work</div>
          </div>

          {/* Exercise Time */}
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-value">{formatTime(todayTotals.totalExercise)}</div>
            <div className="stat-label">Exercise</div>
          </div>

          {/* Total Time */}
          <div className="stat-card highlight">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{formatTime(todayTotals.totalTime)}</div>
            <div className="stat-label">Total Time</div>
          </div>
        </div>

        {/* Session Count */}
        <div className="session-count">
          <span className="count-badge">{todayTotals.sessionCount}</span>
          <span className="count-label">
            {todayTotals.sessionCount === 1 ? "session" : "sessions"} today
          </span>
        </div>
      </div>

      {/* Productivity Score */}
      <div className="summary-section score-section">
        <h3 className="section-title">⚖️ Productivity Score</h3>

        <div className="score-display">
          <div className="score-circle" style={{ borderColor: getScoreColor(todayScore) }}>
            <div className="score-number" style={{ color: getScoreColor(todayScore) }}>
              {todayScore}
            </div>
            <div className="score-max">/100</div>
          </div>

          <div className="score-info">
            <div className="score-label">{getScoreLabel(todayScore)}</div>
            <div className="score-bar">
              <div
                className="score-bar-fill"
                style={{
                  width: `${todayScore}%`,
                  backgroundColor: getScoreColor(todayScore),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Summary */}
      {allEntries.length > 0 && (
        <div className="summary-section weekly-summary">
          <h3 className="section-title">📈 Weekly Summary</h3>

          <div className="weekly-grid">
            <div className="weekly-stat">
              <div className="weekly-value">{formatTime(weeklyStats.weeklyTotal)}</div>
              <div className="weekly-label">Total Week</div>
            </div>

            <div className="weekly-stat">
              <div className="weekly-value">{formatTime(weeklyStats.averageDaily)}</div>
              <div className="weekly-label">Avg/Day</div>
            </div>

            <div className="weekly-stat">
              <div className="weekly-value">{weeklyStats.daysActive}</div>
              <div className="weekly-label">Active Days</div>
            </div>

            <div className="weekly-stat">
              <div className="weekly-value" style={{ color: "#ffb74d" }}>
                {weeklyStats.weekScore}
              </div>
              <div className="weekly-label">Week Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryPanel;
