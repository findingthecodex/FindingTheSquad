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
  
  getUsers: () =>
    API.get('/auth/users'),
};

// LFG endpoints
export const lfgService = {
  createSession: (playerName, gameTitle, discordTag, description) =>
    API.post('/lfg', { playerName, gameTitle, discordTag, description }),
  
  getSessions: () =>
    API.get('/lfg'),
};

export default API;

