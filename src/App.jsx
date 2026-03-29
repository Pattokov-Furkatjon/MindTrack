import { startTransition, useState } from 'react';
import './App.css';
import AppShell from './components/AppShell';
import LandingView from './components/LandingView';
import ToastViewport from './components/ToastViewport';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { useToasts } from './hooks/useToasts';
import AnalyticsPage from './pages/AnalyticsPage';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/NotesPage';
import SessionsPage from './pages/SessionsPage';
import { readMindTrackState, writeMindTrackState } from './utils/storage';

function createEntityId(prefix) {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function App() {
  const [workspaceUnlocked, setWorkspaceUnlocked] = useLocalStorage(
    'mindtrack-workspace-unlocked',
    false,
  );
  const [activePage, setActivePage] = useLocalStorage(
    'mindtrack-active-page',
    'dashboard',
  );
  const [appState, setAppState] = useState(() => readMindTrackState());
  const { theme, toggleTheme } = useTheme();
  const { toasts, pushToast, dismissToast } = useToasts();

  const commitState = (updater) => {
    setAppState((currentState) => {
      const nextState =
        typeof updater === 'function' ? updater(currentState) : updater;

      return writeMindTrackState(nextState);
    });
  };

  const navigateTo = (pageId) => {
    startTransition(() => {
      setActivePage(pageId);
    });
  };

  const handleCreateSession = (sessionValues) => {
    const now = new Date().toISOString();
    const nextSession = {
      id: createEntityId('session'),
      ...sessionValues,
      createdAt: now,
      updatedAt: now,
    };

    commitState((currentState) => ({
      ...currentState,
      sessions: [nextSession, ...currentState.sessions].sort(
        (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
      ),
    }));

    pushToast('Session saved.', 'success');
  };

  const handleUpdateSession = (sessionId, sessionValues) => {
    commitState((currentState) => ({
      ...currentState,
      sessions: currentState.sessions
        .map((session) =>
          session.id === sessionId
            ? {
                ...session,
                ...sessionValues,
                updatedAt: new Date().toISOString(),
              }
            : session,
        )
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)),
    }));

    pushToast('Session updated.', 'success');
  };

  const handleDeleteSession = (sessionId) => {
    commitState((currentState) => ({
      ...currentState,
      sessions: currentState.sessions.filter((session) => session.id !== sessionId),
    }));

    pushToast('Session removed.', 'warning');
  };

  const handleCreateNote = (noteValues) => {
    const now = new Date().toISOString();
    const nextNote = {
      id: createEntityId('note'),
      ...noteValues,
      createdAt: now,
      updatedAt: now,
    };

    commitState((currentState) => ({
      ...currentState,
      notes: [nextNote, ...currentState.notes].sort(
        (left, right) => new Date(right.updatedAt) - new Date(left.updatedAt),
      ),
    }));

    pushToast('Note saved.', 'success');
  };

  const handleUpdateNote = (noteId, noteValues) => {
    commitState((currentState) => ({
      ...currentState,
      notes: currentState.notes
        .map((note) =>
          note.id === noteId
            ? {
                ...note,
                ...noteValues,
                updatedAt: new Date().toISOString(),
              }
            : note,
        )
        .sort((left, right) => new Date(right.updatedAt) - new Date(left.updatedAt)),
    }));

    pushToast('Note updated.', 'success');
  };

  const handleDeleteNote = (noteId) => {
    commitState((currentState) => ({
      ...currentState,
      notes: currentState.notes.filter((note) => note.id !== noteId),
    }));

    pushToast('Note removed.', 'warning');
  };

  const handleToggleNotePin = (noteId) => {
    commitState((currentState) => ({
      ...currentState,
      notes: currentState.notes
        .map((note) =>
          note.id === noteId
            ? {
                ...note,
                pinned: !note.pinned,
                updatedAt: new Date().toISOString(),
              }
            : note,
        )
        .sort((left, right) => {
          if (left.pinned !== right.pinned) {
            return Number(right.pinned) - Number(left.pinned);
          }

          return new Date(right.updatedAt) - new Date(left.updatedAt);
        }),
    }));
  };

  const renderActivePage = () => {
    if (activePage === 'sessions') {
      return (
        <SessionsPage
          sessions={appState.sessions}
          onCreateSession={handleCreateSession}
          onUpdateSession={handleUpdateSession}
          onDeleteSession={handleDeleteSession}
        />
      );
    }

    if (activePage === 'notes') {
      return (
        <NotesPage
          notes={appState.notes}
          onCreateNote={handleCreateNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onToggleNotePin={handleToggleNotePin}
        />
      );
    }

    if (activePage === 'analytics') {
      return <AnalyticsPage sessions={appState.sessions} notes={appState.notes} />;
    }

    return <DashboardPage state={appState} onNavigate={navigateTo} />;
  };

  if (!workspaceUnlocked) {
    return (
      <>
        <LandingView
          sessions={appState.sessions}
          notes={appState.notes}
          onEnter={() => setWorkspaceUnlocked(true)}
        />
        <ToastViewport toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div className="app-root">
      <div className="app-background" aria-hidden="true" />
      <AppShell
        activePage={activePage}
        theme={theme}
        onNavigate={navigateTo}
        onToggleTheme={toggleTheme}
        summary={{
          sessions: appState.sessions.length,
          notes: appState.notes.length,
          pinned: appState.notes.filter((note) => note.pinned).length,
        }}
      >
        {renderActivePage()}
      </AppShell>
      <ToastViewport toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
