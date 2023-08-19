import axios from 'axios';

const authClient = axios.create({
  baseURL: 'localhost:4000',
});

export const createClient = () => {
  return {
    auth: {
      me: () => authClient.get('/me'),
      verify: () => authClient.post('/verify'),
      sessions: () => authClient.post('/sessions'),
    }
  }
}