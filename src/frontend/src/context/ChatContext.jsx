import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [selectedSession, setSelectedSession] = useState(null);

  const handleSetSelectedSession = (session) => {
    console.log('🔧 ChatContext: setSelectedSession called with:', session);
    setSelectedSession(session);
  };

  console.log('🔧 ChatContext: Current selectedSession value:', selectedSession);

  return (
    <ChatContext.Provider value={{ selectedSession, setSelectedSession: handleSetSelectedSession }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  console.log('🔧 useChat hook called - selectedSession:', context.selectedSession);
  return context;
};

