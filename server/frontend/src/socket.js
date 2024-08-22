import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://backend:4000';

export const socket = io("http://localhost:4000", {
    autoConnect: false
  });