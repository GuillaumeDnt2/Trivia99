import {useState} from "react";
import {Navigate} from "react-router-dom";
import {socket} from "./socket";


export default function ProtectedRoute({Component, Redirect}){

    const [loggedIn, setLoggedIn] = useState(false)



    return loggedIn ? <Component /> : <Navigate to="/waiting" />
}