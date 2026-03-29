import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Sessions from './Sessions';
import Notes from './Notes';
import Analytics from './Analytics';

function MainApp({ addNotification }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className='main-app'>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='content'>
        <div className='fade-in'>
          {activeTab === 'dashboard' && <Dashboard addNotification={addNotification} />}
          {activeTab === 'sessions' && <Sessions addNotification={addNotification} />}
          {activeTab === 'notes' && <Notes addNotification={addNotification} />}
          {activeTab === 'analytics' && <Analytics addNotification={addNotification} />}
        </div>
      </div>
    </div>
  );
}

export default MainApp;
