import React from 'react';
import { useTab } from '../../context/TabContext';
import './HomeTab.css';

export default function HomeTab() {
  const { setActiveTab } = useTab();

  return (
    <div className="home-tab">
      <div className="home-header">
        <h1>🎮 Welcome to FindingTheSquad</h1>
        <p>Find your perfect gaming squad and connect with fellow gamers</p>
      </div>

      <div className="home-actions">
        <div className="action-card">
          <div className="action-icon">📋</div>
          <h3>Find Teammates</h3>
          <p>Browse LFG posts and find players for your favorite games</p>
          <button 
            className="action-btn"
            onClick={() => setActiveTab('lfg-posts')}
          >
            View LFG Posts
          </button>
        </div>

        <div className="action-card">
          <div className="action-icon">🎯</div>
          <h3>Create a Post</h3>
          <p>Create your own LFG post and find teammates</p>
          <button 
            className="action-btn"
            onClick={() => setActiveTab('my-sessions')}
          >
            My Sessions
          </button>
        </div>

        <div className="action-card">
          <div className="action-icon">🔍</div>
          <h3>Discover Games</h3>
          <p>Browse by game and console to find exactly what you need</p>
          <button 
            className="action-btn"
            onClick={() => setActiveTab('browse')}
          >
            Browse Games
          </button>
        </div>
      </div>

      <div className="home-stats">
        <div className="stat">
          <h3>Active Sessions</h3>
          <p className="stat-number">50+</p>
        </div>
        <div className="stat">
          <h3>Games</h3>
          <p className="stat-number">100+</p>
        </div>
        <div className="stat">
          <h3>Players</h3>
          <p className="stat-number">500+</p>
        </div>
      </div>
    </div>
  );
}

