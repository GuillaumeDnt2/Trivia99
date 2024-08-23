import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.LOCAL === 'true' ? 'http://localhost:4000' : undefined;
console.log(URL);
console.log(process.env.LOCAL);
export const socket = io(URL, {
    autoConnect: false
  });