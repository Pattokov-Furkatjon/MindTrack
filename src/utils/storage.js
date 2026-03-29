export const APP_STORAGE_KEY = 'mindtrack_state_v2';
const LEGACY_STORAGE_KEY = 'mindtrack_data';

export const SESSION_CATEGORIES = ['Deep Work', 'Study', 'Planning', 'Exercise'];
export const NOTE_TAGS = ['General', 'Ideas', 'Reflection', 'Tasks'];

export function createEmptyState() {
  return {
    sessions: [],
    notes: [],
  };
}

function createId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function toDateOnly(value) {
  if (!value) {
    return new Date().toISOString().slice(0, 10);
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsed.toISOString().slice(0, 10);
}

function normalizeSession(session) {
  if (!session) {
    return null;
  }

  const rawDurationMinutes =
    Number(session.durationMinutes) ||
    Math.round((Number(session.duration) || 0) / 60) ||
    0;

  if (!rawDurationMinutes) {
    return null;
  }

  const createdAt = session.createdAt || session.date || new Date().toISOString();

  return {
    id: session.id || createId('session'),
    title: String(session.title || session.subject || 'Untitled session').trim(),
    category: session.category || session.type || 'Deep Work',
    date: toDateOnly(session.date || createdAt),
    durationMinutes: clamp(rawDurationMinutes, 1, 720),
    focusScore: clamp(Number(session.focusScore || session.mood || 7), 1, 10),
    notes: String(session.notes || '').trim(),
    createdAt,
    updatedAt: session.updatedAt || createdAt,
  };
}

function normalizeNote(note) {
  if (!note) {
    return null;
  }

  const createdAt = note.createdAt || note.date || new Date().toISOString();
  const title = String(note.title || '').trim();
  const content = String(note.content || '').trim();

  if (!title && !content) {
    return null;
  }

  return {
    id: note.id || createId('note'),
    title: title || 'Untitled note',
    content,
    tag: note.tag || 'General',
    pinned: Boolean(note.pinned),
    createdAt,
    updatedAt: note.updatedAt || createdAt,
  };
}

function normalizeState(rawState) {
  const baseState = rawState && typeof rawState === 'object' ? rawState : createEmptyState();

  return {
    sessions: (baseState.sessions || [])
      .map(normalizeSession)
      .filter(Boolean)
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    notes: (baseState.notes || [])
      .map(normalizeNote)
      .filter(Boolean)
      .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt)),
  };
}

export function readMindTrackState() {
  const fallbackState = createEmptyState();

  try {
    const storedState = window.localStorage.getItem(APP_STORAGE_KEY);
    if (storedState) {
      return normalizeState(JSON.parse(storedState));
    }

    const legacyState = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyState) {
      return normalizeState(JSON.parse(legacyState));
    }
  } catch {
    return fallbackState;
  }

  return fallbackState;
}

export function writeMindTrackState(state) {
  const normalizedState = normalizeState(state);
  window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(normalizedState));
  return normalizedState;
}
