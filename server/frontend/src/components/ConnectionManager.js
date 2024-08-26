import React from 'react';
import { socket } from '../utils/socket';

export function ConnectionManager() {
  function connect() {
    console.log("Connecting ...");
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button>
    </>
  );
}