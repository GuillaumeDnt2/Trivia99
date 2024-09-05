import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { socket } from "../utils/socket.js";
import '../styles/Waiting.css';
import BaseLayout from "../components/BaseLayout";

/**
 * Page to display for the player when he's waiting for the game to start
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
 * @returns {JSX.Element}
*/
export default function Waiting(){
    const [playersInfo, setPlayersInfo] = useState({nbReady: 0, nbPlayers: 0}); // Data about ready players
    const [ready, setReady] = useState(false);  // True when ready

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
                <div className="quick-rule">
                    <h3>Quick Rules.</h3>
                    <p>Your goal is to answer the questions in your queue. Questions arrive in your queue at regular intervals, which shrink as time passes. If your queue is full (<b>8</b> questions or more), you are eliminated.</p>
                    <p>Three types of questions : <span style={{color: "var(--easy)"}}>easy</span>, <span style={{color: "var(--medium)"}}>medium</span>, <span style={{color: "var(--hard)"}}>hard</span>.</p>
                    <p>You can chain correct answers: it's your <b>streak</b>. Once your streak reaches 3 or more, you can press the attack button. It will send additional questions to random players (display in <span style={{color: "var(--attack)"}}>red</span> in their stack). The greater the streak, the more questions are sent.</p>
                </div>
        </div>
        </BaseLayout>
}