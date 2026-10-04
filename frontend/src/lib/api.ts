import axios from 'axios';
import { getCookie } from 'cookies-next';

// Check if we are running on the server or in the browser
const isServer = typeof window === 'undefined';

const api = axios.create({
  baseURL: isServer ? process.env.INTERNAL_API_URL : process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  // Don't let a slow/dead backend hang the UI forever (prevents the stuck "TRANSMITTING…" state).
  timeout: 500000,
});

export default api;