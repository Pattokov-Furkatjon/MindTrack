import React from "react";
import "../styles/navbar.css";

/**
 * Navbar Component with Dark/Light Mode Toggle
 */
function Navbar({ isDarkMode, toggleDarkMode }) {
  return (
    <nav className={`navbar ${isDarkMode ? "navbar-dark" : "navbar-light"}`}>
      <h1 className="navbar-logo">🧠 MindTrack</h1>
      <button
        className="navbar-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle dark mode"
        title={isDarkMode ? "Light Mode" : "Dark Mode"}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>
    </nav>
  );
}

export default Navbar;
