import { useEffect, useState } from 'react';
import { NOTE_TAGS } from '../utils/storage';
import { validateNote } from '../utils/validation';

function createNoteDraft(note) {
  return {
    title: note?.title || '',
    tag: note?.tag || NOTE_TAGS[0],
    content: note?.content || '',
    pinned: Boolean(note?.pinned),
  };
}

function NoteForm({ editingNote, onSubmit, onCancel }) {
  const [values, setValues] = useState(createNoteDraft(editingNote));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setValues(createNoteDraft(editingNote));
    setErrors({});
  }, [editingNote]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: type === 'checkbox' ? checked : value,
    }));

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: '',
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = validateNote(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({
      title: values.title.trim(),
      tag: values.tag,
      content: values.content.trim(),
      pinned: values.pinned,
    });

    if (!editingNote) {
      setValues(createNoteDraft(null));
    }

    setErrors({});
  };

  return (
    <section className="surface-card">
      <div className="page__section-header">
        <div>
          <p className="eyebrow">{editingNote ? 'Editing' : 'Capture'}</p>
          <h3>{editingNote ? 'Update note' : 'Write a note'}</h3>
        </div>
      </div>

      <form className="stack-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="note-title">Title</label>
          <input
            id="note-title"
            name="title"
            type="text"
            value={values.title}
            onChange={handleChange}
            placeholder="Weekly planning notes"
          />
          {errors.title ? <span className="field__error">{errors.title}</span> : null}
        </div>

        <div className="form-row">
          <div className="field">
            <label htmlFor="note-tag">Tag</label>
            <select id="note-tag" name="tag" value={values.tag} onChange={handleChange}>
              {NOTE_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>

          <label className="checkbox-field" htmlFor="note-pinned">
            <input
              id="note-pinned"
              name="pinned"
              type="checkbox"
              checked={values.pinned}
              onChange={handleChange}
            />
            Keep pinned
          </label>
        </div>

        <div className="field">
          <label htmlFor="note-content">Content</label>
          <textarea
            id="note-content"
            name="content"
            value={values.content}
            onChange={handleChange}
            placeholder="Capture the decision, the reasoning, and the follow-up."
          />
          {errors.content ? (
            <span className="field__error">{errors.content}</span>
          ) : null}
        </div>

        <div className="form-actions">
          <button type="submit" className="button button--primary">
            {editingNote ? 'Save changes' : 'Add note'}
          </button>
          {editingNote ? (
            <button type="button" className="button button--ghost" onClick={onCancel}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
}

export default NoteForm;
