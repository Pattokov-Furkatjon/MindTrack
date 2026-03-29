import React from 'react';

function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'sessions', label: '⏱️ Sessions', icon: '⏱️' },
    { id: 'notes', label: '📝 Notes', icon: '📝' },
    { id: 'analytics', label: '📈 Analytics', icon: '📈' },
  ];

  return (
    <aside className='sidebar'>
      {tabs.map(tab => (
        <div
          key={tab.id}
          className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span>{tab.icon}</span>
          <span>{tab.label}</span>
        </div>
      ))}
    </aside>
  );
}

export default Sidebar;
