import React, { useState, useEffect } from 'react';
import { lfgService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useTab } from '../context/TabContext';
import './Dashboard.css';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const { setSelectedSession } = useChat();
  const { setActiveTab } = useTab();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const response = await lfgService.getSessions();
      setSessions(response.data);
    } catch (err) {
      setError('Failed to load LFG sessions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleCreateSession = () => {
    // Direktnav till CreateLFG sidan är redan en separat ruta
    // Men vi kan göra det via tab senare
    alert('Gå till "Min sessioner" för att skapa en ny session');
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="logo">🎮 FindingTheSquad</h1>
          <div className="navbar-right">
            <span className="user-info">Welcome, {user?.username || 'User'}!</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2>Looking for Group Sessions</h2>
          <button className="create-btn" onClick={handleCreateSession}>
            + Create New Session
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isLoading ? (
          <div className="loading">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="empty-state">
            <p>No LFG sessions yet. Create one to get started!</p>
          </div>
        ) : (
          <div className="sessions-grid">
            {sessions.map((session) => (
              <div key={session.id} className="session-card">
                <div className="session-header">
                  <h3>{session.gameTitle}</h3>
                  <span className="active-badge">Active</span>
                </div>
                <div className="session-body">
                  <p><strong>Player:</strong> {session.playerName}</p>
                  <p><strong>Discord:</strong> {session.discordTag || 'Not provided'}</p>
                  <p><strong>Description:</strong></p>
                  <p className="description">{session.description}</p>
                  <p className="created-at">
                    Created: {new Date(session.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="session-actions">
                  <button 
                    className="join-btn"
                    onClick={() => {
                      console.log('🎮 Dashboard: Join Session clicked for session:', session);
                      setSelectedSession({
                        id: session.id,
                        userId: session.userId,
                        playerName: session.playerName,
                        gameTitle: session.gameTitle,
                        description: session.description
                      });
                      console.log('🎮 Dashboard: Now switching to chat tab');
                      setActiveTab('chat');
                    }}
                  >
                    Join Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

