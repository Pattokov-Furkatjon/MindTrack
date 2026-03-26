import React from "react";
import { calculateWeeklyStats } from "../utils/logic";
import "../styles/weekly.css";

/**
 * Weekly Summary Component
 * Displays week's performance, trends, and analytics
 */
function WeeklySummary({ entries, isDarkMode }) {
  const weeklyStats = calculateWeeklyStats(entries);

  const getPerformanceLevel = (hours) => {
    if (hours >= 25) return { level: "Exceptional", color: "#4caf50" };
    if (hours >= 20) return { level: "Excellent", color: "#66bb6a" };
    if (hours >= 15) return { level: "Good", color: "#81c784" };
    if (hours >= 10) return { level: "Fair", color: "#ffb74d" };
    return { level: "Low", color: "#ff7043" };
  };

  const performanceLevel = getPerformanceLevel(weeklyStats.weeklyTotal);

  return (
    <div className={`weekly-container ${isDarkMode ? "weekly-dark" : ""}`}>
      <h2 className="weekly-title">📊 Weekly Overview</h2>

      {/* Stats Grid */}
      <div className="weekly-stats-grid">
        {/* Total Hours */}
        <div className="weekly-stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-info">
            <p className="stat-title">Total Hours</p>
            <p className="stat-value">{weeklyStats.weeklyTotal}h</p>
            <p className="stat-label">this week</p>
          </div>
        </div>

        {/* Daily Average */}
        <div className="weekly-stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-info">
            <p className="stat-title">Daily Average</p>
            <p className="stat-value">{weeklyStats.averageDaily}h</p>
            <p className="stat-label">per day</p>
          </div>
        </div>

        {/* Best Day */}
        <div className="weekly-stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <p className="stat-title">Best Day</p>
            <p className="stat-value">{weeklyStats.bestDay}h</p>
            <p className="stat-label">peak performance</p>
          </div>
        </div>

        {/* Average Focus */}
        <div className="weekly-stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <p className="stat-title">Avg Focus</p>
            <p className="stat-value">{weeklyStats.averageFocus}/10</p>
            <p className="stat-label">concentration</p>
          </div>
        </div>

        {/* Days Active */}
        <div className="weekly-stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p className="stat-title">Days Active</p>
            <p className="stat-value">{weeklyStats.daysActive}/7</p>
            <p className="stat-label">days tracked</p>
          </div>
        </div>

        {/* Performance Badge */}
        <div className="weekly-stat-card" style={{ borderTopColor: performanceLevel.color }}>
          <div className="stat-icon">⭐</div>
          <div className="stat-info">
            <p className="stat-title">Rating</p>
            <p className="stat-value" style={{ color: performanceLevel.color }}>
              {performanceLevel.level}
            </p>
            <p className="stat-label">this week</p>
          </div>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="daily-breakdown">
        <h3 className="breakdown-title">📅 Daily Breakdown</h3>
        <div className="daily-bars">
          {weeklyStats.lastSevenDays.map((day) => (
            <div key={day.date} className="daily-bar-container">
              <div className="daily-bar-wrapper">
                {day.entry ? (
                  <>
                    <div
                      className="daily-bar"
                      style={{
                        height: `${Math.min((day.entry.totalTime / 8) * 100, 100)}%`,
                      }}
                      title={`${day.entry.totalTime}h, Focus: ${day.entry.focusLevel || "N/A"}/10`}
                    />
                  </>
                ) : (
                  <div className="daily-bar-empty" />
                )}
              </div>
              <p className="daily-label">{day.dayName}</p>
              {day.entry && (
                <p className="daily-hours">{day.entry.totalTime}h</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Goal Progress */}
      <div className="weekly-goal">
        <h3 className="goal-title">🎯 Weekly Goal Progress</h3>
        <div className="goal-description">
          Target: 35 hours/week
        </div>
        <div className="progress-container">
          <div className="progress-bar-large">
            <div
              className="progress-fill-large"
              style={{
                width: `${Math.min((weeklyStats.weeklyTotal / 35) * 100, 100)}%`,
              }}
            />
          </div>
          <div className="progress-info">
            <span className="progress-current">{weeklyStats.weeklyTotal}h</span>
            <span className="progress-separator">/</span>
            <span className="progress-target">35h</span>
            <span className="progress-percent">
              ({Math.round((weeklyStats.weeklyTotal / 35) * 100)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Insights */}
      {weeklyStats.daysActive > 0 && (
        <div className={`insights-section ${isDarkMode ? "insights-dark" : ""}`}>
          <h3 className="insights-title">💡 Key Insights</h3>
          <ul className="insights-list">
            {weeklyStats.averageDaily >= 5 && (
              <li>✅ Consistency: You averaged {weeklyStats.averageDaily}h/day!</li>
            )}
            {weeklyStats.averageFocus >= 7 && (
              <li>🎯 Focus: Your average focus is {weeklyStats.averageFocus}/10 - excellent concentration!</li>
            )}
            {weeklyStats.daysActive === 7 && (
              <li>🔥 Perfect week: You tracked all 7 days!</li>
            )}
            {weeklyStats.bestDay > weeklyStats.averageDaily * 1.5 && (
              <li>💪 Peak day: Your best day ({weeklyStats.bestDay}h) shows your potential!</li>
            )}
            {weeklyStats.weeklyTotal < 15 && (
              <li>📈 Challenge: Try to reach 35 hours this week for optimal productivity!</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default WeeklySummary;
