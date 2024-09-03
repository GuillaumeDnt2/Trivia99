import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.LOCAL === 'true' ? 'http://localhost:4000' : 'http://localhost:4000';
//const URL = 'http://trivia99.zapto.org:4000';
console.log(URL);
console.log(process.env.LOCAL);

export const socket = io(URL, {
    autoConnect: true,
    /*
    transportOptions: {
        polling: {
            extraHeaders: {
                authorization: document.cookie
            }
        }
    }
     */
    transports: ['websocket'],
    auth: {
        token: document.cookie
    }
  });