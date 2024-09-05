import { io } from 'socket.io-client';

/**
 * Initialize the socket to communicate with the backend
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
*/

//const URL = 'http://localhost:4000';
const URL = 'http://trivia99.zapto.org:4000';

export const socket = io(URL, {
    autoConnect: true,
    auth: {
        token: document.cookie
    }
  });
