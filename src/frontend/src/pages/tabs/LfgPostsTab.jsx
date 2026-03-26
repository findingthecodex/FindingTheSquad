import React, { useState, useEffect } from 'react';
import { lfgService } from '../../services/api';
import SessionDetailModal from '../../components/SessionDetailModal';
import { useNavigate } from 'react-router-dom';
import { GAMES, CONSOLES } from '../../constants/games';
import './LfgPostsTab.css';

export default function LfgPostsTab() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [consoleFilter, setConsoleFilter] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sessions, gameFilter, consoleFilter]);

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

  const applyFilters = () => {
    let filtered = sessions;

    if (gameFilter) {
      filtered = filtered.filter(s =>
        s.gameTitle.toLowerCase().includes(gameFilter.toLowerCase())
      );
    }

    if (consoleFilter) {
      filtered = filtered.filter(s => s.console === consoleFilter);
    }

    setFilteredSessions(filtered);
  };


  return (
    <div className="lfg-posts-tab">
      <div className="posts-header">
        <h2>LFG Posts</h2>
        <p>Browse looking for group posts and find your squad</p>
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="game-filter">Game:</label>
          <select
            id="game-filter"
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Games</option>
            {GAMES.map((game) => (
              <option key={game} value={game}>
                {game}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="console-filter">Console:</label>
          <select
            id="console-filter"
            value={consoleFilter}
            onChange={(e) => setConsoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Consoles</option>
            {CONSOLES.map((console) => (
              <option key={console} value={console}>
                {console}
              </option>
            ))}
          </select>
        </div>

        <button onClick={() => { setGameFilter(''); setConsoleFilter(''); }} className="reset-btn">
          Reset Filters
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading">Loading sessions...</div>
      ) : filteredSessions.length === 0 ? (
        <div className="empty-state">
          <p>No LFG posts found. Try adjusting your filters or create a new post!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredSessions.map((session) => (
            <div key={session.id} className="post-card">
              <div className="post-header">
                <div className="game-info">
                  <h3>{session.gameTitle}</h3>
                  <span className="console-badge">{session.console}</span>
                </div>
                {session.isActive && <span className="active-badge">Active</span>}
              </div>
              <div className="post-body">
                <p><strong>Player:</strong> {session.playerName}</p>
                <p><strong>Discord:</strong> {session.discordTag || 'Not provided'}</p>
                <p><strong>Description:</strong></p>
                <p className="description">{session.description}</p>
                <p className="created-at">
                  Created: {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="post-actions">
                <button className="view-btn" onClick={() => setSelectedSession(session)}>View</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <SessionDetailModal 
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        onChat={(session) => {
          navigate('/dashboard', { state: { openChat: session } });
        }}
      />
    </div>
  );
}

