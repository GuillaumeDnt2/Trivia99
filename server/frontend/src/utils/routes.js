import Home from "../pages/Home";
import Waiting from "../pages/Waiting";
import Game from "../pages/Game";
import Ranking from "../pages/Ranking";
import About from "../pages/About";
import React from "react";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/ProtectedRoute";

/**
 * Routes for the website
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
*/
const routes = [
    {
        path: "/",
        element: <ProtectedRoute Component={Home} />,
        errorElement: <NotFound/>,
    },
    {
        path: "/waiting",
        element: <ProtectedRoute Component={Waiting} />
    },
    {
        path: "/game",
        element: <ProtectedRoute Component={Game} />
    },
    {
        path: "/ranking",
        element: <ProtectedRoute Component={Ranking} />
    },
    {
        path: "/about",
        element: <About />
    }
];

export default routes;