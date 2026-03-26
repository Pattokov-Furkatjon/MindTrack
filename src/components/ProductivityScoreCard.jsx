import React from "react";
import { calculateProductivityScore, getTodayEntry } from "../utils/logic";
import "../styles/stats-cards.css";

/**
 * Productivity Score Card (Balance Score)
 * Shows a 0-100 score based on today's study time, exercise, and focus level
 */
function ProductivityScoreCard({ entries, isDarkMode }) {
  const todayEntry = getTodayEntry(entries);

  if (!todayEntry) {
    return (
      <div className={`stats-card productivity-card ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="card-header">
          <h3 className="card-title">⚖️ Balance Score</h3>
        </div>
        <div className="score-content">
          <div className="score-message">
            <p>Add your first entry today to see your productivity score! 🎯</p>
          </div>
        </div>
      </div>
    );
  }

  const score = calculateProductivityScore(
    todayEntry.totalTime || todayEntry.study || 0,
    todayEntry.exercise || 0,
    todayEntry.focusLevel || 0
  );

  const getScoreColor = (s) => {
    if (s >= 80) return "#6bcf7f"; // green
    if (s >= 60) return "#ffd93d"; // yellow
    if (s >= 40) return "#ff9800"; // orange
    return "#ff6b6b"; // red
  };

  const getScoreLabel = (s) => {
    if (s >= 90) return "🔥 Exceptional";
    if (s >= 80) return "⭐ Excellent";
    if (s >= 70) return "👍 Great";
    if (s >= 60) return "📈 Good";
    if (s >= 50) return "👌 Decent";
    if (s >= 30) return "⚠️ Needs Work";
    return "💪 Get Started";
  };

  const scoreBreakdown = [
    { label: "Study Time (40%)", value: todayEntry.totalTime || todayEntry.study || 0 },
    { label: "Exercise (30%)", value: todayEntry.exercise || 0 },
    {
      label: "Focus Level (30%)",
      value: ((todayEntry.focusLevel || 0) / 10) * 100,
    },
  ];

  return (
    <div className={`stats-card productivity-card ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="card-header">
        <h3 className="card-title">⚖️ Balance Score</h3>
        <span className="score-label">{getScoreLabel(score)}</span>
      </div>

      {/* Main Score Circle */}
      <div className="score-container">
        <div className="score-circle" style={{ borderColor: getScoreColor(score) }}>
          <div className="score-value" style={{ color: getScoreColor(score) }}>
            {score}
          </div>
          <div className="score-max">/100</div>
        </div>
        <div className="score-bar-wrapper">
          <div className="score-bar">
            <div
              className="score-bar-fill"
              style={{
                width: `${score}%`,
                backgroundColor: getScoreColor(score),
              }}
            />
          </div>
          <div className="score-text">
            {score >= 80
              ? "Outstanding performance! Keep it up! 🚀"
              : score >= 60
              ? "Good progress! There's always room for improvement."
              : score >= 40
              ? "You're getting there! Push a bit harder."
              : "Start strong! Every session counts. 💪"}
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="score-breakdown">
        <h4 className="breakdown-title">Score Breakdown</h4>
        {scoreBreakdown.map((item, idx) => (
          <div key={idx} className="breakdown-item">
            <span className="breakdown-label">{item.label}</span>
            <div className="breakdown-bar">
              <div
                className="breakdown-bar-fill"
                style={{
                  width: `${Math.min(
                    item.value < 10 && item.label.includes("Time")
                      ? (item.value / 5) * 100
                      : item.value < 10 && item.label.includes("Exercise")
                      ? (item.value / 1) * 100
                      : item.value,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductivityScoreCard;
