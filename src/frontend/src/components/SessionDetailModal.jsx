import React from 'react';
import './SessionDetailModal.css';

export default function SessionDetailModal({ session, onClose, onChat }) {
  if (!session) return null;

  const handleChatClick = () => {
    console.log('💬 SessionDetailModal: Chat button clicked!');
    console.log('   - Calling onChat callback with session:', session);
    console.log('   - onChat function exists:', !!onChat);
    
    if (onChat) {
      onChat(session);
    } else {
      console.error('❌ SessionDetailModal: onChat callback is undefined!');
    }
    
    console.log('   - Calling onClose callback');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="game-section">
            <h2>{session.gameTitle}</h2>
            <span className="console-badge-detail">{session.console}</span>
            {session.isActive && <span className="active-badge">Active</span>}
          </div>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Player Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Player Name:</label>
                <p>{session.playerName}</p>
              </div>
              <div className="info-item">
                <label>Discord Tag:</label>
                <p>{session.discordTag || 'Not provided'}</p>
              </div>
              <div className="info-item">
                <label>Platform:</label>
                <p>{session.console}</p>
              </div>
              <div className="info-item">
                <label>Created:</label>
                <p>{new Date(session.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Looking For</h3>
            <div className="description-box">
              <p>{session.description}</p>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="chat-btn" onClick={handleChatClick}>
            💬 Chat with {session.playerName}
          </button>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

