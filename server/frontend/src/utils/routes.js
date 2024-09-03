import Home from "../pages/Home";
import Waiting from "../pages/Waiting";
import Game from "../pages/Game";
import Ranking from "../pages/Ranking";
import About from "../pages/About";
import React from "react";
import NotFound from "../pages/NotFound";
import Test from "../pages/Test";
import Zebi from "../pages/Zebi";
import ProtectedRoute from "../components/ProtectedRoute";


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