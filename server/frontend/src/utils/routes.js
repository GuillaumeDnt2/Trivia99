import Home from "../pages/Home";
import Waiting from "../pages/Waiting";
import Game from "../pages/Game";
import Ranking from "../pages/Ranking";
import React from "react";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";


const routes = [
    {
        path: "/",
        element: <ProtectedRoute Component={Home} />,
        errorElement: <NotFound/>,
    },
    {
        path: "/waiting",
        element: <Waiting />
    },
    {
        path: "/game",
        element: <ProtectedRoute Component={Game} />
    },
    {
        path: "/ranking",
        element: <ProtectedRoute Component={Ranking} />
    }
];

export default routes;