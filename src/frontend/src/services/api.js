import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const authService = {
  register: (email, username, password) =>
    API.post('/auth/register', { email, username, password }),
  
  login: (email, password) =>
    API.post('/auth/login', { email, password }),

  discordCallback: (code, state) =>
    API.post('/auth/discord/callback', { code, state }),
  
  getUsers: () =>
    API.get('/auth/users'),
};

// LFG endpoints
export const lfgService = {
  createSession: (playerName, gameTitle, discordTag, description, console) =>
    API.post('/lfg', { playerName, gameTitle, discordTag, description, console }),
  
  getSessions: () =>
    API.get('/lfg'),

  getFilteredSessions: (gameTitle, console) =>
    API.get('/lfg/filter', { params: { gameTitle, console } }),

  getSimilarSessions: (gameTitle, console) =>
    API.get('/lfg/filter', { params: { gameTitle, console } }),
};

// Chat endpoints
export const chatService = {
  sendMessage: (receiverId, lfgSessionId, content) =>
    API.post('/chat/send', { receiverId, lfgSessionId, content }),
  
  getConversation: (otherUserId, lfgSessionId) =>
    API.get('/chat/conversation', { params: { otherUserId, lfgSessionId } }),
};

export default API;

