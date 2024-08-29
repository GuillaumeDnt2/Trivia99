import Home from "../pages/Home";
import Waiting from "../pages/Waiting";
import Game from "../pages/Game";
import Ranking from "../pages/Ranking";
import React from "react";
import NotFound from "../pages/NotFound";
import Test from "../pages/Test";
import Zebi from "../pages/Zebi";


const routes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <NotFound/>,
    },
    {
        path: "/waiting",
        element: <Waiting />     },
    {
        path: "/game",
        element: <Game />
    },
    {
        path: "/ranking",
        element: <Ranking />
    },
    {
        path: "/test",
        element: <Test />
    },
    {
        path: "/zebi",
        element: <Zebi />
    }
];

export default routes;