import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {socket} from "../utils/socket";
import {useLocation} from "react-router-dom";

export default function ProtectedRoute({Component}){

    const [gameState, setGameState] = useState("")
    const [loggedIn, setLoggedIn] = useState(false)
    const location = useLocation();

    useEffect(() => {

        socket.on("gameStatus", (state) => {
            console.log("Game status: " + state)
            setGameState(state)
        })

        socket.on("loggedInfo", (state) => {
            console.log("Logged info: " + state)
            setLoggedIn(state)
        })

        console.log("Emitting getGameStatus")
        socket.emit("getGameStatus")
        console.log("Emitting isUserLogged")
        socket.emit("isUserLogged")

        return () => {
            socket.off("gameStatus")
            socket.off("loggedInfo")
        }
    }, []);



    if(loggedIn !== undefined && gameState === ""){
        return <Navigate to={location.pathname} />;
    }

    if (!loggedIn && location.pathname !== "/") {
        return <Navigate to="/" />;
    }

    if (loggedIn && gameState === "started" && location.pathname !== "/game") {
        return <Navigate to="/game" />;
    }

    if (loggedIn && gameState === "waiting" && location.pathname !== "/waiting") {
        return <Navigate to="/waiting" />;
    }

    if (loggedIn && gameState === "ended" && location.pathname !== "/ranking") {
        return <Navigate to="/ranking" />;
    }

    return <Component />;
}