import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import MainApp from './components/MainApp';
import Toast from './components/Toast';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('isLoggedIn')) || false;
    } catch {
      return false;
    }
  });

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  const removeNotification = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (!isLoggedIn) {
    return <Hero onStart={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className='app'>
      <Header theme={theme} toggleTheme={toggleTheme} onLogout={() => setIsLoggedIn(false)} />
      <MainApp addNotification={addNotification} />
      <Toast items={toasts} onDismiss={removeNotification} />
    </div>
  );
}

export default App;
