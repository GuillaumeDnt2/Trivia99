import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { socket } from "../utils/socket.js";
import logo from "../assets/Trivia99.png";
import './Waiting.css';

export default function Waiting(){
    const [playersInfo, setPlayersInfo] = useState({nbReady: 0, nbPlayers: 0});
    const [ready, setReady] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        function onPlayersConnected(newValue){
            setPlayersInfo(newValue);
        }

        function onStart(){
            navigate("/game");
        }

        socket.on("playersConnected", onPlayersConnected);
        socket.on("startGame", onStart);

        socket.emit("getReadyInfo")

        return () => {
            socket.off("playersConnected");
            socket.off("startGame");
        }
    }, [navigate]);

    function onClick() {
        socket.emit("ready");
        setReady(true);
    }


    return <>
            <div className="vertical">
                <img src={logo} alt="Trivia 99 logo"/>
                <div className="rounded-box">
                    <p>{playersInfo.nbReady}/{playersInfo.nbPlayers} player(s) ready</p>
                    <button id="readyBtn" onClick={onClick} disabled={ready}>Ready?</button>
                </div>
            </div>
        </>
}