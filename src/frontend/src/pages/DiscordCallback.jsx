import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DiscordCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleDiscordCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          setError('No authorization code received from Discord');
          setLoading(false);
          return;
        }

        // Send code to backend
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/discord/callback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, state }),
        });

        if (!response.ok) {
          throw new Error('Discord login failed');
        }

        const data = await response.json();
        const { token, userId, username, email } = data;

        // Save token and user info
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ userId, username, email }));

        // Redirect to dashboard
        setLoading(false);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message || 'Failed to authenticate with Discord');
        setLoading(false);
      }
    };

    handleDiscordCallback();
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f1219 0%, #1a1d27 100%)',
    }}>
      <div style={{
        textAlign: 'center',
        color: '#ffffff',
      }}>
        {loading && (
          <>
            <h2>🎮 Logging in with Discord...</h2>
            <p>Please wait...</p>
          </>
        )}
        {error && (
          <>
            <h2>❌ Error</h2>
            <p>{error}</p>
            <button onClick={() => navigate('/login')} style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #00a3cc 100%)',
              color: '#0f1219',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginTop: '20px'
            }}>
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

