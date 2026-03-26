import React from "react";
import "../styles/welcome-section.css";

/**
 * WelcomeSection Component
 * Introduces the app and guides the user
 */
function WelcomeSection({ isDarkMode, userName = "User" }) {
  return (
    <div className={`welcome-section ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Main Welcome Card */}
      <div className="welcome-card">
        <div className="welcome-header">
          <h1 className="welcome-title">🧠 Welcome to MindTrack</h1>
          <p className="welcome-subtitle">Your personal daily routine management system</p>
        </div>

        {/* What is MindTrack */}
        <div className="welcome-description">
          <p>
            MindTrack helps you <strong>structure your day</strong> by tracking focused work
            sessions. Whether it's studying, working, or exercising, every session counts.
          </p>
        </div>

        {/* Quick Guide */}
        <div className="quick-guide">
          <h3 className="guide-title">📋 How to Use MindTrack</h3>

          <div className="guide-steps">
            <div className="guide-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Choose Activity</h4>
                <p>Select whether you're doing Study, Work, or Exercise</p>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Start Session</h4>
                <p>Click "Start" and begin tracking your focused work</p>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>End Session</h4>
                <p>Click "End" when you're done. The duration is automatically calculated</p>
              </div>
            </div>

            <div className="guide-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>View Progress</h4>
                <p>See your daily productivity score and weekly statistics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="key-features">
          <h3 className="features-title">✨ Key Features</h3>

          <div className="features-list">
            <div className="feature">
              <span className="feature-icon">⏱️</span>
              <span className="feature-text">Live session timer with automatic duration tracking</span>
            </div>

            <div className="feature">
              <span className="feature-icon">📊</span>
              <span className="feature-text">Real-time productivity metrics and scoring</span>
            </div>

            <div className="feature">
              <span className="feature-icon">📈</span>
              <span className="feature-text">Weekly analytics and progress tracking</span>
            </div>

            <div className="feature">
              <span className="feature-icon">💡</span>
              <span className="feature-text">Smart feedback and motivation messages</span>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="welcome-cta">
          <p className="cta-text">Ready to optimize your routine?</p>
          <p className="cta-subtext">👇 Start by clicking "Start a New Session" below</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
