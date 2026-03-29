import React from 'react';

function Header({ theme, toggleTheme, onLogout }) {
  return (
    <header className='header'>
      <div className='header-left'>
        <div className='logo'>MindTrack</div>
      </div>
      <div className='header-right'>
        <button className='btn btn-ghost' onClick={toggleTheme}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button className='btn btn-primary' onClick={onLogout}>
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default Header;
