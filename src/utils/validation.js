function isBlank(value) {
  return !String(value || '').trim();
}

export function validateSession(values) {
  const errors = {};
  const durationMinutes = Number(values.durationMinutes);
  const focusScore = Number(values.focusScore);

  if (isBlank(values.title)) {
    errors.title = 'Add a session title.';
  } else if (String(values.title).trim().length < 2) {
    errors.title = 'Session title must be at least 2 characters.';
  }

  if (isBlank(values.category)) {
    errors.category = 'Select a session category.';
  }

  if (isBlank(values.date)) {
    errors.date = 'Choose a session date.';
  }

  if (!Number.isFinite(durationMinutes) || durationMinutes < 1) {
    errors.durationMinutes = 'Duration must be at least 1 minute.';
  } else if (durationMinutes > 720) {
    errors.durationMinutes = 'Duration must stay under 12 hours.';
  }

  if (!Number.isFinite(focusScore) || focusScore < 1 || focusScore > 10) {
    errors.focusScore = 'Focus score must stay between 1 and 10.';
  }

  if (String(values.notes || '').length > 400) {
    errors.notes = 'Notes must stay under 400 characters.';
  }

  return errors;
}

export function validateNote(values) {
  const errors = {};

  if (isBlank(values.title)) {
    errors.title = 'Add a note title.';
  } else if (String(values.title).trim().length < 2) {
    errors.title = 'Note title must be at least 2 characters.';
  }

  if (isBlank(values.content)) {
    errors.content = 'Add some note content.';
  } else if (String(values.content).trim().length < 8) {
    errors.content = 'Note content must be at least 8 characters.';
  }

  if (String(values.content || '').length > 1500) {
    errors.content = 'Note content must stay under 1500 characters.';
  }

  return errors;
}
