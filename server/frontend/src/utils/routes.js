import Home from "../pages/Home";
import Waiting from "../pages/Waiting";
import Game from "../pages/Game";
import Ranking from "../pages/Ranking";
import React from "react";
import NotFound from "../pages/NotFound";
import ProtectedRouteNavToHome from "../components/ProtectedRouteNavToHome";
import ProtectedRouteGoBack from "../components/ProtectedRouteGoBack";


const routes = [
    {
        path: "/",
        element: <ProtectedRouteGoBack Component={Home} />,
        errorElement: <NotFound/>,
    },
    {
        path: "/waiting",
        element: <ProtectedRouteNavToHome Component={Waiting} />
    },
    {
        path: "/game",
        element: <ProtectedRouteNavToHome Component={Game} />
    },
    {
        path: "/ranking",
        element: <ProtectedRouteNavToHome Component={Ranking} />
    }
];

export default routes;