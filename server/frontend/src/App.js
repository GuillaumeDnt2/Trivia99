import React, {useEffect} from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useCookies } from "react-cookie";
import routes from "./utils/routes";
import {socket} from "./utils/socket";

export default function App() {

    const [cookies, setCookie] = useCookies(['userId']);
    const router = createBrowserRouter(routes);

    useEffect(() => {
        socket.on('setCookie', (serializedCookie) => {
            const cookie = serializedCookie.split(';')[0];
            const [name, value] = cookie.split('=');
            setCookie(name, value, { path: '/' });
        });
    }, [setCookie]);

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}