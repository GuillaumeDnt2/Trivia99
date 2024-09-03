import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { socket } from "../utils/socket.js";
import '../styles/Waiting.css';
import BaseLayout from "../components/BaseLayout";

export default function Waiting(){
    const [playersInfo, setPlayersInfo] = useState({nbReady: 0, nbPlayers: 0});
    const [ready, setReady] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const onPlayersConnected = (newValue) =>{
            setPlayersInfo(newValue);
        }

        const onStart = () => {
            console.log("Game starting")
            socket.emit("getGameStatus")
            socket.emit("isUserLogged")
            navigate("/game");
        }

        socket.on("playersConnected", onPlayersConnected);
        socket.on("startGame", onStart);

        socket.emit("getReadyInfo")

        return () => {
            socket.off("playersConnected", onPlayersConnected);
            socket.off("startGame", onStart);
        }
    }, [navigate]);

    const onClick = () => {
        socket.emit("ready");
        setReady(true);
    }


    return <BaseLayout>
        <div className={"content-column-box center padding-20px"}>
                <p className={"text"}>{playersInfo.nbReady}/{playersInfo.nbPlayers} player(s) ready</p>
                <button id="readyBtn" className={'orange-button'} onClick={onClick} disabled={ready}>Ready ?</button>
        </div>
        </BaseLayout>
}