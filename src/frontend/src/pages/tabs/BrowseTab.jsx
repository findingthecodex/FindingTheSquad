import React, { useState, useEffect } from 'react';
import { lfgService } from '../../services/api';
import './BrowseTab.css';

const CONSOLES = ['PC', 'PS5', 'Xbox Series X/S', 'Nintendo Switch'];

export default function BrowseTab() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedConsole, setSelectedConsole] = useState(null);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (selectedGame && selectedConsole) {
      filterSessions();
    }
  }, [selectedGame, selectedConsole]);

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const response = await lfgService.getSessions();
      const uniqueGames = [...new Set(response.data.map(s => s.gameTitle))].sort();
      setGames(uniqueGames);
    } catch (err) {
      console.error('Failed to load games:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSessions = async () => {
    try {
      const response = await lfgService.getFilteredSessions(selectedGame, selectedConsole);
      setFilteredSessions(response.data);
    } catch (err) {
      console.error('Failed to filter sessions:', err);
    }
  };

  return (
    <div className="browse-tab">
      <div className="browse-header">
        <h2>Browse by Game & Console</h2>
        <p>Discover LFG posts for your favorite games</p>
      </div>

      <div className="browse-container">
        <div className="games-sidebar">
          <h3>Games</h3>
          {isLoading ? (
            <p className="loading-text">Loading games...</p>
          ) : games.length === 0 ? (
            <p className="no-games">No games found</p>
          ) : (
            <div className="games-list">
              {games.map((game) => (
                <button
                  key={game}
                  className={`game-item ${selectedGame === game ? 'active' : ''}`}
                  onClick={() => setSelectedGame(game)}
                >
                  {game}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="content-main">
          {selectedGame && (
            <>
              <div className="consoles-section">
                <h3>Select Console</h3>
                <div className="console-grid">
                  {CONSOLES.map((console) => (
                    <button
                      key={console}
                      className={`console-card ${selectedConsole === console ? 'active' : ''}`}
                      onClick={() => setSelectedConsole(console)}
                    >
                      {console}
                    </button>
                  ))}
                </div>
              </div>

              {selectedConsole && (
                <div className="results-section">
                  <h3>{selectedGame} on {selectedConsole}</h3>
                  {filteredSessions.length === 0 ? (
                    <div className="no-results">
                      <p>No LFG posts found for this combination</p>
                    </div>
                  ) : (
                    <div className="results-grid">
                      {filteredSessions.map((session) => (
                        <div key={session.id} className="result-card">
                          <div className="result-header">
                            <h4>{session.playerName}</h4>
                            <span className="active-badge">Active</span>
                          </div>
                          <p className="result-description">{session.description}</p>
                          <p className="result-discord"><strong>Discord:</strong> {session.discordTag}</p>
                          <button className="result-action-btn">Message Player</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {!selectedGame && (
            <div className="empty-browse">
              <p>Select a game to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

