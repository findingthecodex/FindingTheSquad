import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTab } from '../context/TabContext';
import { useLocation } from 'react-router-dom';
import HomeTab from './tabs/HomeTab';
import LfgPostsTab from './tabs/LfgPostsTab';
import MySessionsTab from './tabs/MySessionsTab';
import BrowseTab from './tabs/BrowseTab';
import ChatTab from './tabs/ChatTab';
import './TabbedLayout.css';

export default function TabbedLayout() {
  const { user, logout } = useAuth();
  const { activeTab, setActiveTab } = useTab();
  const location = useLocation();

  // Switch to chat tab if openChat state is provided
  useEffect(() => {
    if (location.state?.openChat) {
      setActiveTab('chat');
    }
  }, [location.state?.openChat, setActiveTab]);

  const tabs = [
    { id: 'home', label: '🏠 Home', icon: '🏠' },
    { id: 'lfg-posts', label: '📋 LFG Posts', icon: '📋' },
    { id: 'my-sessions', label: '👤 My Sessions', icon: '👤' },
    { id: 'browse', label: '🔍 Browse', icon: '🔍' },
    { id: 'chat', label: '💬 Chat', icon: '💬' },
  ];

  const handleLogout = () => {
    logout();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab />;
      case 'lfg-posts':
        return <LfgPostsTab />;
      case 'my-sessions':
        return <MySessionsTab />;
      case 'browse':
        return <BrowseTab />;
      case 'chat':
        return <ChatTab />;
      default:
        return <HomeTab />;
    }
  };

  return (
    <div className="tabbed-layout">
      {/* Left Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">🎮</h1>
          <h2 className="brand">FindingTheSquad</h2>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label.replace(/^[^\s]+ /, '')}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase() || 'U'}</div>
            <div className="user-details">
              <p className="user-name">{user?.username || 'User'}</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {renderTabContent()}
      </main>
    </div>
  );
}

