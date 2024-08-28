import Home from "../pages/Home";
import Waiting from "../pages/Waiting";
import Game from "../pages/Game";
import Ranking from "../pages/Ranking";
import React from "react";
import NotFound from "../pages/NotFound";


const routes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <NotFound/>,
    },
    {
        path: "/waiting",
        element: <Waiting />
    },
    {
        path: "/game",
        element: <Game />
    },
    {
        path: "/ranking",
        element: <Ranking />
    }
];

export default routes;