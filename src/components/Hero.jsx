import React from 'react';

function Hero({ onStart }) {
  return (
    <div className='hero'>
      <div className='hero-content'>
        <h1>MindTrack</h1>
        <p>Master your productivity. Track your sessions. Achieve your goals with intelligent insights.</p>
        <button className='hero-btn' onClick={onStart}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Hero;
