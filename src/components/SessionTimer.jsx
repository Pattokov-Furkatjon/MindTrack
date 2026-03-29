import { useEffect, useState } from 'react';

function formatElapsed(elapsedSeconds) {
  const minutes = Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
}

function SessionTimer({ onApplyDuration }) {
  const [running, setRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds((currentSeconds) => currentSeconds + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [running]);

  const applyDuration = () => {
    if (elapsedSeconds < 1) {
      return;
    }

    onApplyDuration(Math.max(1, Math.round(elapsedSeconds / 60)));
  };

  return (
    <section className="surface-card timer">
      <div className="page__section-header">
        <div>
          <p className="eyebrow">Session timer</p>
          <h3>Track a live block</h3>
        </div>
      </div>

      <div className="timer__display">{formatElapsed(elapsedSeconds)}</div>
      <p className="muted">
        Start the timer, pause when needed, then apply the captured duration to the form.
      </p>

      <div className="timer__actions">
        <button
          type="button"
          className="button button--primary"
          onClick={() => setRunning(true)}
          disabled={running}
        >
          Start
        </button>
        <button
          type="button"
          className="button button--secondary"
          onClick={() => setRunning(false)}
          disabled={!running}
        >
          Pause
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={() => {
            setRunning(false);
            setElapsedSeconds(0);
          }}
          disabled={elapsedSeconds === 0}
        >
          Reset
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={applyDuration}
          disabled={elapsedSeconds === 0}
        >
          Apply to form
        </button>
      </div>
    </section>
  );
}

export default SessionTimer;
