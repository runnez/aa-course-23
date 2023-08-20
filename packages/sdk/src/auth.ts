import axios from 'axios';

const authClient = axios.create({
  baseURL: 'http://localhost:4000',
});

export const setToken = (token: string) => {
  authClient.defaults.headers.common['x-access-token'] = token;
}

export const createClient = () => {
  return {
    auth: {
      verify: async (headers: any) => {
        console.log('sdk run verify');
        const { data } = await authClient.post('/verify', undefined, { headers: { 'x-access-token': headers['x-access-token'] } })
        return data;
      },
      sessions: (data: {}) => authClient.post('/sessions', data),
    }
  }
}