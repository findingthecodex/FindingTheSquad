import React, { useState } from 'react';
import './ChatTab.css';

export default function ChatTab() {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      user: 'Player123',
      game: 'Valorant',
      lastMessage: 'Hey, want to play ranked?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      unread: 2,
    },
    {
      id: 2,
      user: 'GamerKing',
      game: 'Fortnite',
      lastMessage: 'Squad up for 50v50 later?',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      unread: 0,
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Player123', text: 'Hey, want to play ranked?', timestamp: new Date(Date.now() - 1000 * 60 * 5) },
    { id: 2, sender: 'You', text: 'Sure! Let me log in.', timestamp: new Date(Date.now() - 1000 * 60 * 4) },
  ]);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You',
        text: messageInput,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setMessageInput('');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-tab">
      <div className="chat-container">
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h3>Messages</h3>
            <button className="new-message-btn">+</button>
          </div>
          <div className="conversations-list">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="conversation-info">
                  <h4>{conv.user}</h4>
                  <p className="game-label">{conv.game}</p>
                  <p className="last-message">{conv.lastMessage}</p>
                </div>
                <div className="conversation-meta">
                  <span className="timestamp">{formatTime(conv.timestamp)}</span>
                  {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-main">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <h3>{selectedConversation.user}</h3>
                  <p>{selectedConversation.game}</p>
                </div>
                <button className="chat-options-btn">⋮</button>
              </div>

              <div className="messages-container">
                {messages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.sender === 'You' ? 'sent' : 'received'}`}>
                    <div className="message-bubble">
                      <p>{msg.text}</p>
                      <span className="message-time">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input-container">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="message-input"
                />
                <button onClick={handleSendMessage} className="send-btn">
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-conversation">
              <div className="empty-icon">💬</div>
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

