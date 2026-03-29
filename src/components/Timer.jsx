import React, { useEffect, useMemo, useState } from "react";

function Timer({ isDarkMode, t }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(25 * 60);

  const total = useMemo(() => minutes * 60 + seconds, [minutes, seconds]);

  useEffect(() => {
    setRemaining(total);
  }, [total]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [running, remaining]);

  useEffect(() => {
    if (remaining !== 0) return;
    if (!running) return;
    setRunning(false);
    const audio = new Audio("https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg");
    audio.play().catch(() => null);
    alert(t("timerComplete"));
  }, [remaining, running, t]);

  const display = useMemo(() => {
    const m = Math.floor(remaining / 60).toString().padStart(2, "0");
    const s = (remaining % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }, [remaining]);

  return (
    <div className={`timer-card glass-card ${isDarkMode ? "dark-mode" : ""}`}>
      <h3>{t("timerTitle")}</h3>
      <div className="timer-display">{display}</div>
      <div className="timer-controls">
        <input type="number" min="0" max="120" value={minutes} onChange={(e) => setMinutes(Math.max(0, Number(e.target.value) || 0))} aria-label="Minutes" />
        <input type="number" min="0" max="59" value={seconds} onChange={(e) => setSeconds(Math.min(59, Math.max(0, Number(e.target.value) || 0)))} aria-label="Seconds" />
      </div>
      <div className="timer-buttons">
        <button className="btn primary" onClick={() => setRunning(true)} disabled={remaining <= 0}>{t("start")}</button>
        <button className="btn secondary" onClick={() => setRunning(false)}>{t("stop")}</button>
        <button className="btn ghost" onClick={() => { setRunning(false); setRemaining(total); }}>{t("reset")}</button>
      </div>
    </div>
  );
}

export default Timer;