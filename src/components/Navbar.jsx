import React from 'react';

function Navbar({ theme, toggleTheme, locale, setLocale, t }) {
  return (
    <header className='navbar'>
      <div className='brand'>
        <span className='brand-title'>MindTrack</span>
      </div>

      <div className='navbar-actions'>
        <button className='btn btn-ghost' onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
