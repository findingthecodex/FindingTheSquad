import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { token } = useAuth();

  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <div className="home">
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="logo">🎮 FindingTheSquad</h1>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Gaming Squad</h1>
          <p className="hero-subtitle">
            Connect with gamers looking to team up. Create LFG posts and find your perfect squad.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="features-container">
          <h2>Why Choose FindingTheSquad?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Easy to Use</h3>
              <p>Simple and intuitive interface to create and find LFG posts</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Secure</h3>
              <p>Your data is protected with JWT authentication and encryption</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast</h3>
              <p>Instant notifications when someone joins your squad</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Community</h3>
              <p>Join thousands of gamers finding their perfect squad</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2026 FindingTheSquad. All rights reserved.</p>
      </footer>
    </div>
  );
}

