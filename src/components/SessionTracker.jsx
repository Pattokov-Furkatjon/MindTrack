import React, { useState, useEffect } from "react";
import { createSession } from "../utils/logic";
import "../styles/session-tracker.css";

/**
 * SessionTracker Component
 * Manages starting and ending work sessions with live timer
 */
function SessionTracker({ onSessionComplete, isDarkMode }) {
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState("study");
  const [startTime, setStartTime] = useState("");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer effect
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const handleStartSession = () => {
    if (!sessionType) {
      alert("Please select a session type");
      return;
    }

    const now = new Date();
    const timeString = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    setStartTime(timeString);
    setElapsedSeconds(0);
    setIsActive(true);
  };

  const handleEndSession = () => {
    if (!isActive || !startTime) return;

    const now = new Date();
    const endTimeString = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    // Create session object
    const session = createSession(sessionType, startTime, endTimeString);

    // Call parent callback
    onSessionComplete(session);

    // Reset state
    setIsActive(false);
    setSessionType("study");
    setStartTime("");
    setElapsedSeconds(0);
  };

  const sessionTypeLabels = {
    study: "📚 Study",
    work: "💼 Work",
    exercise: "💪 Exercise",
  };

  const sessionTypeEmojis = {
    study: "📚",
    work: "💼",
    exercise: "💪",
  };

  return (
    <div className={`session-tracker ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="tracker-container">
        {!isActive ? (
          // Start Session UI
          <div className="tracker-start">
            <h3 className="tracker-title">🚀 Start a New Session</h3>

            {/* Session Type Selection */}
            <div className="session-type-selector">
              {Object.entries(sessionTypeLabels).map(([type, label]) => (
                <button
                  key={type}
                  className={`type-button ${sessionType === type ? "active" : ""}`}
                  onClick={() => setSessionType(type)}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Start Button */}
            <button className="btn-start" onClick={handleStartSession}>
              ▶️ Start {sessionTypeLabels[sessionType]}
            </button>

            <p className="tracker-hint">
              Click start to begin tracking your session. You can end it anytime.
            </p>
          </div>
        ) : (
          // Active Session UI
          <div className="tracker-active">
            <h3 className="tracker-title">
              {sessionTypeEmojis[sessionType]} {sessionTypeLabels[sessionType]} in Progress
            </h3>

            {/* Timer Display */}
            <div className="timer-display">
              <div className="timer-value">{formatElapsedTime(elapsedSeconds)}</div>
              <div className="timer-started">Started at {startTime}</div>
            </div>

            {/* Session Info Card */}
            <div className="session-info">
              <div className="info-item">
                <span className="info-label">Session Type</span>
                <span className="info-value">{sessionTypeLabels[sessionType]}</span>
              </div>
            </div>

            {/* End Button */}
            <button className="btn-end" onClick={handleEndSession}>
              ⏹️ End Session
            </button>

            <p className="tracker-hint">
              Your progress is being tracked. Click 'End Session' when you're done.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SessionTracker;
