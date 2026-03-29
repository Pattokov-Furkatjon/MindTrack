import { useEffect, useState } from 'react';
import { getTodayKey } from '../utils/formatters';
import { SESSION_CATEGORIES } from '../utils/storage';
import { validateSession } from '../utils/validation';

function createSessionDraft(session) {
  return {
    title: session?.title || '',
    category: session?.category || SESSION_CATEGORIES[0],
    date: session?.date || getTodayKey(),
    durationMinutes:
      session?.durationMinutes !== undefined ? String(session.durationMinutes) : '',
    focusScore: session?.focusScore ? String(session.focusScore) : '7',
    notes: session?.notes || '',
  };
}

function SessionForm({ editingSession, timerMinutes, onSubmit, onCancel }) {
  const [values, setValues] = useState(createSessionDraft(editingSession));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(createSessionDraft(editingSession));
    setErrors({});
  }, [editingSession]);

  useEffect(() => {
    if (!timerMinutes) {
      return;
    }

    setValues((currentValues) => ({
      ...currentValues,
      durationMinutes: String(timerMinutes),
    }));
  }, [timerMinutes]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateSession(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title: values.title.trim(),
      category: values.category,
      date: values.date,
      durationMinutes: Number(values.durationMinutes),
      focusScore: Number(values.focusScore),
      notes: values.notes.trim(),
    });

    if (!editingSession) {
      setValues(createSessionDraft(null));
    }

    setErrors({});
  };

  return (
    <section className="surface-card">
      <div className="page__section-header">
        <div>
          <p className="eyebrow">{editingSession ? 'Editing' : 'Create'}</p>
          <h3>{editingSession ? 'Update session' : 'Add a session'}</h3>
        </div>
      </div>

      <form className="stack-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="session-title">Session title</label>
          <input
            id="session-title"
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            placeholder="Deep work on dashboard redesign"
          />
          {errors.title ? <span className="field__error">{errors.title}</span> : null}
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="session-category">Category</label>
            <select
              id="session-category"
              name="category"
              value={values.category}
              onChange={handleChange}
            >
              {SESSION_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category ? (
              <span className="field__error">{errors.category}</span>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="session-date">Date</label>
            <input
              id="session-date"
              name="date"
              type="date"
              value={values.date}
              onChange={handleChange}
            />
            {errors.date ? <span className="field__error">{errors.date}</span> : null}
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="session-duration">Duration in minutes</label>
            <input
              id="session-duration"
              name="durationMinutes"
              type="number"
              min="1"
              max="720"
              value={values.durationMinutes}
              onChange={handleChange}
              placeholder="45"
            />
            {errors.durationMinutes ? (
              <span className="field__error">{errors.durationMinutes}</span>
            ) : null}
          </div>

          <div className="field">
            <label htmlFor="session-focus">Focus score</label>
            <input
              id="session-focus"
              name="focusScore"
              type="number"
              min="1"
              max="10"
              value={values.focusScore}
              onChange={handleChange}
            />
            {errors.focusScore ? (
              <span className="field__error">{errors.focusScore}</span>
            ) : null}
          </div>
        </div>

        <div className="field">
          <label htmlFor="session-notes">Notes</label>
          <textarea
            id="session-notes"
            name="notes"
            value={values.notes}
            onChange={handleChange}
            placeholder="What worked, what dragged, and what to repeat next time."
          />
          {errors.notes ? <span className="field__error">{errors.notes}</span> : null}
        </div>

        <div className="form-actions">
          <button type="submit" className="button button--primary">
            {editingSession ? 'Save changes' : 'Add session'}
          </button>
          {editingSession ? (
            <button type="button" className="button button--ghost" onClick={onCancel}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default SessionForm;
