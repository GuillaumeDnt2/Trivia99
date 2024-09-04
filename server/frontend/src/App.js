import React, {useEffect} from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useCookies } from "react-cookie";
import routes from "./utils/routes";
import {socket} from "./utils/socket";

export default function App() {

    const [cookies, setCookie] = useCookies(['userId']);
    const router = createBrowserRouter(routes);

    useEffect(() => {
        const handleCookie = (serializedCookie) => {
            let [cookie, maxAge, path, , sameSite] = serializedCookie.split(";")
            const [name, value] = cookie.split("=")
            maxAge = maxAge.split("=")[1]
            path = path.split("=")[1]
            sameSite = sameSite.split("=")[1]
            setCookie(name, value, { path: path, maxAge: maxAge, sameSite: sameSite});
        }

        socket.on('setCookie', handleCookie);

        return () => {
            socket.off("setCookie", handleCookie)
        }
    }, [setCookie]);

    return (
        <div className="App">
            <RouterProvider router={router} />
        </div>
    );
}