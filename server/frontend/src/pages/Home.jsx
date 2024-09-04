import "../styles/Home.css";
import {socket} from "../utils/socket.js";
import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import github from "../assets/github-mark.svg"
import BaseLayout from "../components/BaseLayout";

/**
 * React file for the home page of Trivia99
 *
 * @author Arthur Junod
 * @author Guillaume Dunant
 * @author Valentin Bonzon
 * @author Edwin Haeffner
 * @returns {JSX.Element}
*/

export default function Home(){

    const [name, setName] = useState("");
    const [placeholder, setPlaceholder] = useState("Enter your name")
    const [gameFull, setGameFull] = useState(false)
    const [gameStarted, setGameStarted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const handleGameStart = () => {
            setGameStarted(true)
        }

        const gameResetGame = () => {
            setGameStarted(false)
            setGameFull(false)
        }

        const handleGameStatus = (state) => {
            setGameStarted(state==="started" || state==="ended")
        }

        const handleLoggedInfo = () => {
            navigate('/waiting')
        }

        const handleGameFull = () => {
            setGameFull(true)
        }

        const handleGameNotFull = () => {
            setGameFull(false)
        }

        socket.on("startGame", handleGameStart)
        socket.on("gameReset", gameResetGame)
        socket.on("gameStatus", handleGameStatus)
        socket.on("loggedInfo", handleLoggedInfo)
        socket.on("gameFull", handleGameFull)
        socket.on("gameNotFull" , handleGameNotFull)

        socket.emit("getGameStatus")
        socket.emit("isGameFull")

        return () => {
            socket.off("startGame", handleGameStart);
            socket.off("gameReset", gameResetGame)
            socket.off("gameStatus", handleGameStatus);
            socket.off("loggedInfo", handleLoggedInfo);
            socket.off("gameFull", handleGameFull)
            socket.off("gameNotFull", handleGameNotFull)
        }
    }, [navigate]);



    const handleSubmit = (e) => {
        e.preventDefault()
        if(name.length !== 0){
            // Message 'login' that send the name chosen by the user
            socket.emit(
                'login',
                name
            )
        }else {
            // Set the colour of the placeholder to red and change text
            document.querySelector("input").style.setProperty("--c", "red");
            setPlaceholder("You must enter a name...")
        }
    }

    return <BaseLayout>
            <div className={"content-column-box center padding-20px gap-20px"}>
                <form onSubmit={handleSubmit} className="content-column-box gap-20px">
                    <label className={"content-row-box"}><p className={"username-home"}>Username</p>
                        <input
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            placeholder={placeholder}
                        />
                    </label>
                    <button type="submit" className={"orange-button"} disabled={gameStarted || gameFull}>{gameStarted ? "Game in progress..." : gameFull ? "No more places left" : "Click to play !"}</button>
                </form>
                <button onClick={() => navigate("/about") } className={"content-row-box center gap-in-button orange-button"}>Rules</button>
                <Link to="https://guillaumednt2.github.io/Trivia99/" className="no-underline" target="_blank">
                    <button className={"content-row-box center gap-in-button orange-button"}>About</button>
                </Link>
                <Link to="https://github.com/GuillaumeDnt2/Trivia99/tree/main" className="no-underline" target="_blank">
                    <button type="button" className={"content-row-box center gap-in-button orange-button"}>GitHub<img src={github} alt="GitHub" className={"image-git"}/></button>
                </Link>
            </div>
        </BaseLayout>
}
