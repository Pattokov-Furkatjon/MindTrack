import React from "react";

function HeroSection({ t, onStartTracking }) {
  return (
    <section className="hero-section glass-card">
      <div className="hero-content">
        <h1>{t("appTitle")}</h1>
        <p>{t("heroTagline")}</p>
        <div className="hero-actions">
          <button className="btn primary" onClick={onStartTracking}>
            {t("startTracking")}
          </button>
          <button className="btn secondary" onClick={() => window.location.hash = "#/analytics"}>
            {t("viewAnalytics")}
          </button>
        </div>
      </div>
      <div className="hero-graphic" aria-hidden="true">
        <div className="hero-badge">⚡</div>
      </div>
    </section>
  );
}

export default HeroSection;