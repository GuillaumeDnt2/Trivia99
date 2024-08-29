import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {socket} from "../utils/socket";


export default function ProtectedRouteNavToHome({Component}){

    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        socket.emit("isUserLogged")

        socket.on("loggedInfo", (state) => {
            setLoggedIn(state.loggedInInfo)
        })

        return () => {
            socket.off("loggedInfo")
        }
    }, []);

    return loggedIn ? <Component /> : <Navigate to="/" />
}