import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.VM_MOD === 'production' ? undefined : 'http://localhost:4000';
console.log(URL);
console.log(process.env.VM_MOD);
export const socket = io(URL, {
    autoConnect: false
  });