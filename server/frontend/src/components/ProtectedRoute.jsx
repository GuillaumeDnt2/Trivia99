import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {socket} from "../utils/socket";
import {useLocation} from "react-router-dom";

/**
 * The protected routes avoid the unconnected player to access some pages
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
 * @returns {JSX.Element}
*/
export default function ProtectedRoute({Component}){

    const [gameState, setGameState] = useState("")
    const [loggedIn, setLoggedIn] = useState(false)
    const location = useLocation();

    useEffect(() => {

        const handleGameStatus = (state) => {
            console.log("Game status: " + state)
            setGameState(state)
        }

        const handleLoggedInfo = (state) => {
            console.log("Logged info: " + state)
            setLoggedIn(state)
        }

        socket.on("gameStatus", handleGameStatus)
        socket.on("loggedInfo", handleLoggedInfo)

        socket.emit("getGameStatus")
        socket.emit("isUserLogged")

        return () => {
            socket.off("gameStatus", handleGameStatus)
            socket.off("loggedInfo", handleLoggedInfo)
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