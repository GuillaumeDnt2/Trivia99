import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {socket} from "../utils/socket";


export default function ProtectedRouteGoBack({Component}){

    const navigate = useNavigate();

    const goBack = useCallback( () => {
        navigate(-1);
    }, [navigate])

    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        socket.emit("isUserLogged")

        socket.on("loggedInfo", (state) => {
            setLoggedIn(state)
            console.log("User's state in GoBack :" + state)
        })

        return () => {
            socket.off("loggedInfo")
        }
    }, []);

    useEffect(() => {
        if(loggedIn){
            goBack()
        }
    }, [loggedIn, goBack]);

    return <Component />
}