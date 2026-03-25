import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleDiscordLogin = () => {
    const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/discord/callback`;
    const state = Math.random().toString(36).substring(7);
    
    if (!clientId) {
      alert('Discord Client ID not configured');
      return;
    }
    
    localStorage.setItem('discord_state', state);
    
    // Build Discord OAuth URL with required parameters only
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'identify email',
      state: state
    });
    
    const discordOAuthUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
    window.location.href = discordOAuthUrl;
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '24px 0',
          gap: '12px'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: '#2a2d3a'
          }}></div>
          <span style={{ color: '#606876', fontSize: '12px' }}>OR</span>
          <div style={{
            flex: 1,
            height: '1px',
            background: '#2a2d3a'
          }}></div>
        </div>

        {/* Social Login */}
        <button 
          type="button"
          onClick={handleDiscordLogin}
          className="social-btn discord-btn"
          style={{
            width: '100%',
            padding: '12px 24px',
            background: '#5865F2',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '15px',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => e.target.style.background = '#4752C4'}
          onMouseOut={(e) => e.target.style.background = '#5865F2'}
        >
          🎮 Login with Discord
        </button>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
