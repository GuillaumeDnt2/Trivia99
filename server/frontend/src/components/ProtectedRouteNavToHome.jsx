import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {socket} from "../utils/socket";


export default function ProtectedRouteNavToHome({Component}){

    const [loggedIn, setLoggedIn] = useState(true)

    useEffect(() => {
        socket.emit("isUserLogged")

        socket.on("loggedInfo", (state) => {
            setLoggedIn(state)
            console.log("User's state in NavToHome :" + state)
        })

        return () => {
            socket.off("loggedInfo")
        }
    }, []);

    return loggedIn ? <Component /> : <Navigate to="/" />
}