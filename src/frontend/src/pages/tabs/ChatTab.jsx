import React, { useState, useEffect } from 'react';
import { chatService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import './ChatTab.css';

export default function ChatTab() {
  const { user } = useAuth();
  const { selectedSession, setSelectedSession } = useChat();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  console.log('💬 ChatTab mounted - selectedSession:', selectedSession, 'user:', user);

  // Handle incoming chat from selectedSession
  useEffect(() => {
    console.log('🔄 ChatTab useEffect - selectedSession changed:', selectedSession);
    if (selectedSession && user) {
      console.log('✅ ChatTab: Both selectedSession and user exist, calling loadConversation');
      loadConversation(selectedSession);
    } else {
      console.log('⚠️ ChatTab: Waiting for selectedSession and user:', { hasSession: !!selectedSession, hasUser: !!user });
    }
  }, [selectedSession, user]);

  const loadConversation = async (session) => {
    try {
      console.log('💬 ChatTab: loadConversation called with session:', session);
      
      if (!session || !session.id || !session.userId) {
        console.error('❌ ChatTab: Invalid session data:', session);
        return;
      }
      
      setIsLoading(true);
      console.log('📡 ChatTab: Fetching conversation from API...');
      const response = await chatService.getConversation(session.userId, session.id);
      
      console.log('✅ ChatTab: Conversation API response:', response);
      
      if (!response || !response.data) {
        console.error('❌ ChatTab: No data in API response');
        setIsLoading(false);
        return;
      }
      
      const newConv = {
        id: session.id,
        userId: session.userId,
        user: session.playerName,
        game: session.gameTitle,
        lastMessage: response.data.length > 0 ? response.data[response.data.length - 1].content : 'Conversation started',
        timestamp: new Date(),
        unread: 0,
      };
      
      console.log('🗣️ ChatTab: Setting conversation:', newConv);
      setConversations(prev => {
        const filtered = prev.filter(c => c.id !== session.id);
        return [newConv, ...filtered];
      });
      setSelectedConversation(newConv);
      
      console.log('📝 ChatTab: Mapping messages from response data:', response.data);
      setMessages(response.data.map(msg => ({
        id: msg.messageId,
        sender: msg.senderUsername,
        senderId: msg.senderId,
        text: msg.content,
        timestamp: new Date(msg.createdAt),
      })));
      console.log('✅ ChatTab: Messages set successfully');
    } catch (err) {
      console.error('❌ ChatTab: Failed to load conversation:', err);
      console.error('❌ ChatTab: Error response:', err.response?.data);
      console.error('❌ ChatTab: Error message:', err.message);
      alert('Kunde inte ladda konversation: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    console.log('💬 ChatTab: handleSendMessage called');
    console.log('   - messageInput:', messageInput);
    console.log('   - selectedConversation:', selectedConversation);
    console.log('   - user:', user);
    
    if (!messageInput.trim()) {
      console.log('❌ ChatTab: Message input is empty');
      return;
    }
    
    if (!selectedConversation) {
      console.log('❌ ChatTab: No conversation selected');
      return;
    }
    
    if (!user) {
      console.log('❌ ChatTab: User not authenticated');
      return;
    }

    try {
      const messageData = {
        receiverId: selectedConversation.userId,
        lfgSessionId: selectedConversation.id,
        content: messageInput
      };
      
      console.log('📤 ChatTab: Sending message to API with data:', messageData);
      console.log('   - Receiver (userId from session):', selectedConversation.userId);
      console.log('   - LfgSessionId:', selectedConversation.id);
      console.log('   - Current user (SenderId):', user.userId);

      const response = await chatService.sendMessage(
        selectedConversation.userId,
        selectedConversation.id,
        messageInput
      );
      
      console.log('✅ ChatTab: Message sent successfully! API Response:', response);
      console.log('   - Response data:', response.data);
      console.log('   - Message ID from response:', response.data?.messageId);
      
      const newMessage = {
        id: response.data?.messageId || Date.now(),
        sender: user.username,
        senderId: user.userId,
        text: messageInput,
        timestamp: new Date(response.data?.createdAt || new Date()),
      };
      
      console.log('📝 ChatTab: Adding new message to state:', newMessage);
      setMessages([...messages, newMessage]);
      setMessageInput('');
      console.log('✅ ChatTab: Message added to UI');
    } catch (err) {
      console.error('❌ ChatTab: Failed to send message!');
      console.error('   - Error:', err.message);
      console.error('   - Response data:', err.response?.data);
      console.error('   - Status code:', err.response?.status);
      alert('Kunde inte skicka meddelandet: ' + (err.response?.data?.message || err.message));
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
                {isLoading ? (
                  <div className="loading">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="no-messages">No messages yet. Start the conversation!</div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.senderId === user?.userId ? 'sent' : 'received'}`}>
                      <div className="message-bubble">
                        <p className="message-sender">{msg.sender}</p>
                        <p>{msg.text}</p>
                        <span className="message-time">{formatTime(msg.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
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

