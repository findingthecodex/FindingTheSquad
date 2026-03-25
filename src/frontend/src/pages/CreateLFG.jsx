import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { lfgService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './CreateLFG.css';

export default function CreateLFG() {
  const [formData, setFormData] = useState({
    playerName: '',
    gameTitle: '',
    discordTag: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await lfgService.createSession(
        formData.playerName,
        formData.gameTitle,
        formData.discordTag,
        formData.description
      );
      setSuccess('LFG session created successfully!');
      setFormData({
        playerName: '',
        gameTitle: '',
        discordTag: '',
        description: '',
      });
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-lfg-container">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="logo">🎮 FindingTheSquad</h1>
          <button 
            className="back-btn" 
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="create-form-container">
        <div className="form-card">
          <h1>Create New LFG Session</h1>
          <p className="subtitle">Looking for {user?.username}? Post your session here!</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="playerName">Player Name *</label>
              <input
                type="text"
                id="playerName"
                name="playerName"
                value={formData.playerName}
                onChange={handleChange}
                placeholder="Your in-game nickname"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="gameTitle">Game Title *</label>
              <input
                type="text"
                id="gameTitle"
                name="gameTitle"
                value={formData.gameTitle}
                onChange={handleChange}
                placeholder="e.g., Valorant, CS:GO, League of Legends"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="discordTag">Discord Tag</label>
              <input
                type="text"
                id="discordTag"
                name="discordTag"
                value={formData.discordTag}
                onChange={handleChange}
                placeholder="Your#1234"
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What are you looking for? (e.g., 'Looking for 2 people for ranked 5-stack, Need good communication')"
                rows="5"
                required
                disabled={isLoading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button 
              type="submit" 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Session...' : 'Create Session'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

