import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import {socket} from "../utils/socket";


export default function ProtectedRouteNavToHome({Component}){

    const [loggedIn, setLoggedIn] = useState(true)

    /*
      @SubscribeMessage("isUserLogged")
  onIsUserLogged(@ConnectedSocket() socket: any){
    let loggedInfo = this.game.getPlayers().has(this.getIdFromHeaders(socket));
    this.server.to(socket.id).emit("loggedInfo",loggedInfo);
  }
     */
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