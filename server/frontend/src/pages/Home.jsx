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
    const [gameStarted, setGameStarted] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const handleGameStartedTrue = () => {
            setGameStarted(true)
        }

        const handleGameStartedFalse = () => {
            setGameStarted(false)
        }

        const handleGameStatus = (state) => {
            setGameStarted(state==="started" || state==="ended")
        }

        const handleLoggedInfo = () => {
            navigate('/waiting')
        }

        socket.on("startGame", handleGameStartedTrue)

        socket.on("gameReset", handleGameStartedFalse)

        socket.on("gameStatus", handleGameStatus)

        socket.on("loggedInfo", handleLoggedInfo)

        socket.emit("getGameStatus")

        return () => {
            socket.off("startGame", handleGameStartedTrue);
            socket.off("gameReset", handleGameStartedFalse)
            socket.off("gameStatus", handleGameStatus);
            socket.off("loggedInfo", handleLoggedInfo);
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
                    <button type="submit" className={"orange-button"} disabled={gameStarted}>{gameStarted ? "Game in progress..." : "Click to play !"}</button>
                </form>
                <button onClick={() => navigate("/about") } className={"content-row-box center gap-in-button orange-button"}>About the game</button>
                <Link to="https://github.com/GuillaumeDnt2/Trivia99/tree/main">
                    <button type="button" className={"content-row-box center gap-in-button orange-button"}>GitHub<img src={github} alt="GitHub" className={"image-git"}/></button>
                </Link>
            </div>
        </BaseLayout>
}