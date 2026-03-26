import React from "react";
import { calculateWeeklyAverages } from "../utils/logic";
import "../styles/stats-cards.css";

/**
 * Weekly Average Stats Card
 * Displays average study time, exercise, and focus over the past 7 days
 */
function WeeklyAverageCard({ entries, isDarkMode }) {
  const stats = calculateWeeklyAverages(entries);

  const getColor = (value, threshold1, threshold2) => {
    if (value >= threshold2) return "#6bcf7f"; // green
    if (value >= threshold1) return "#ffd93d"; // yellow
    return "#ff6b6b"; // red
  };

  return (
    <div className={`stats-card weekly-avg-card ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="card-header">
        <h3 className="card-title">📊 Weekly Average</h3>
        <span className="card-badge">{stats.totalDaysTracked}/7 days</span>
      </div>

      <div className="stats-grid">
        {/* Average Study Time */}
        <div className="stat-item">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-label">Avg Study/Day</div>
            <div
              className="stat-value"
              style={{ color: getColor(stats.avgStudyTime, 3, 5) }}
            >
              {stats.avgStudyTime.toFixed(1)}h
            </div>
          </div>
        </div>

        {/* Average Exercise */}
        <div className="stat-item">
          <div className="stat-icon">💪</div>
          <div className="stat-content">
            <div className="stat-label">Avg Exercise/Day</div>
            <div
              className="stat-value"
              style={{ color: getColor(stats.avgExercise, 0.5, 1) }}
            >
              {stats.avgExercise.toFixed(1)}h
            </div>
          </div>
        </div>

        {/* Average Focus */}
        <div className="stat-item">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-label">Avg Focus Level</div>
            <div className="stat-value">{stats.avgFocus}/10</div>
          </div>
        </div>

        {/* Days Tracked */}
        <div className="stat-item">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <div className="stat-label">Days Tracked</div>
            <div className="stat-value">{stats.totalDaysTracked}</div>
          </div>
        </div>
      </div>

      {/* Insight Message */}
      <div className="card-insight">
        {stats.totalDaysTracked === 0 && (
          <p>Start tracking to see your weekly averages! 🚀</p>
        )}
        {stats.totalDaysTracked > 0 && stats.totalDaysTracked < 4 && (
          <p>
            Keep building the habit! You've tracked {stats.totalDaysTracked} days this week. 💪
          </p>
        )}
        {stats.totalDaysTracked >= 4 && stats.totalDaysTracked < 7 && (
          <p>Almost there! {7 - stats.totalDaysTracked} more day(s) to complete the week! 📈</p>
        )}
        {stats.totalDaysTracked === 7 && (
          <p>🔥 Perfect week! You tracked all 7 days. Consistency is key!</p>
        )}
      </div>
    </div>
  );
}

export default WeeklyAverageCard;
