import React from "react";
import {
  getTodayEntry,
  generateSmartFeedback,
  calculateSessionTotals,
  getMotivationalMessage,
} from "../utils/logic";
import WelcomeSection from "./WelcomeSection";
import SessionTracker from "./SessionTracker";
import SessionCard from "./SessionCard";
import SummaryPanel from "./SummaryPanel";
import "../styles/dashboard.css";

/**
 * Dashboard Component
 * Professional daily routine management system
 */
function Dashboard({ entries, onSessionAdd, onSessionDelete, isDarkMode }) {
  const todayEntry = getTodayEntry(entries);
  const motivationalMessage = getMotivationalMessage();

  // Get today's sessions
  const todaySessions = todayEntry?.sessions || [];
  const todayTotals = calculateSessionTotals(todaySessions);

  // Generate smart feedback
  const { message, type } = generateSmartFeedback(
    todayTotals.totalStudy,
    todayTotals.totalWork,
    todayTotals.totalExercise,
    todayTotals.sessionCount
  );

  const handleSessionComplete = (session) => {
    onSessionAdd(session);
  };

  const handleSessionDelete = (sessionId) => {
    onSessionDelete(sessionId);
  };

  return (
    <div className={`dashboard ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Motivational Banner */}
      <div className="motivational-banner">
        <p className="motivational-text">{motivationalMessage}</p>
      </div>

      {/* Welcome Section (shown when no sessions yet) */}
      {todaySessions.length === 0 && (
        <WelcomeSection isDarkMode={isDarkMode} />
      )}

      {/* Session Tracker - Always visible */}
      <SessionTracker
        onSessionComplete={handleSessionComplete}
        isDarkMode={isDarkMode}
      />

      {/* Today's Sessions */}
      {todaySessions.length > 0 && (
        <div className="today-sessions-section">
          <h2 className="section-heading">
            📋 Today's Sessions ({todaySessions.length})
          </h2>

          <div className="sessions-grid">
            {todaySessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                isDarkMode={isDarkMode}
                onDelete={handleSessionDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* Smart Feedback Section */}
      {todaySessions.length > 0 && (
        <div className={`feedback-section feedback-${type}`}>
          <div className="feedback-icon">
            {type === "excellent" && "🔥"}
            {type === "positive" && "👍"}
            {type === "warning" && "⚠️"}
            {type === "neutral" && "💡"}
          </div>
          <div className="feedback-content">
            <p className="feedback-message">{message}</p>
            {type === "excellent" && (
              <p className="feedback-subtext">
                Keep this momentum! You're doing amazing 🚀
              </p>
            )}
            {type === "warning" && (
              <p className="feedback-subtext">
                A few more focused sessions can help you reach your goals!
              </p>
            )}
          </div>
        </div>
      )}

      {/* Summary Panel */}
      {todaySessions.length > 0 && (
        <SummaryPanel
          todayEntry={todayEntry}
          allEntries={entries}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}

export default Dashboard;
