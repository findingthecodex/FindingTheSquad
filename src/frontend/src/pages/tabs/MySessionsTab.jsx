import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lfgService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './MySessionsTab.css';

export default function MySessionsTab() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setIsLoading(true);
      const response = await lfgService.getSessions();
      // Filter to only show sessions created by current user
      const userSessions = response.data.filter(s => s.playerName === user?.username);
      setSessions(userSessions);
    } catch (err) {
      setError('Failed to load your sessions');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = () => {
    navigate('/create-lfg');
  };

  const handleMarkAsCompleted = async (sessionId) => {
    // TODO: Implement mark as completed functionality
    alert('Mark as completed - feature coming soon!');
  };

  const handleDelete = async (sessionId) => {
    // TODO: Implement delete functionality
    alert('Delete - feature coming soon!');
  };

  return (
    <div className="my-sessions-tab">
      <div className="sessions-header">
        <h2>My LFG Sessions</h2>
        <button className="create-new-btn" onClick={handleCreateNew}>
          + Create New Session
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading your sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No Sessions Yet</h3>
          <p>You haven't created any LFG sessions yet</p>
          <button className="empty-action-btn" onClick={handleCreateNew}>
            Create Your First Session
          </button>
        </div>
      ) : (
        <div className="sessions-list">
          {sessions.map((session) => (
            <div key={session.id} className="session-item">
              <div className="session-item-header">
                <div className="session-title">
                  <h3>{session.gameTitle}</h3>
                  <span className="console-badge">{session.console}</span>
                </div>
                <div className="session-status">
                  {session.isActive ? (
                    <span className="status-active">Active</span>
                  ) : (
                    <span className="status-completed">Completed</span>
                  )}
                </div>
              </div>

              <div className="session-item-content">
                <p><strong>Description:</strong> {session.description}</p>
                <p><strong>Discord:</strong> {session.discordTag || 'Not provided'}</p>
                <p className="created-date">
                  Created: {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="session-item-actions">
                {session.isActive && (
                  <button
                    className="action-btn mark-completed-btn"
                    onClick={() => handleMarkAsCompleted(session.id)}
                  >
                    Mark as Completed
                  </button>
                )}
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(session.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

