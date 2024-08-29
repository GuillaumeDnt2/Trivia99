import "../styles/Home.css";
import {socket} from "../utils/socket.js";
import {useState} from "react";
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

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        if(name.length !== 0){
            // Message 'login' that send the name chosen by the user
            socket.emit(
                'login',
                {name: name}
            )
            navigate('/waiting')
        }else {
            // Set the colour of the placeholder to red and change text
            document.querySelector("input").style.setProperty("--c", "red");
            setPlaceholder("You must enter a name...")
        }
    }

    return <BaseLayout>
                <form onSubmit={handleSubmit} className="content-column-box">
                    <label>Username
                        <input
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            placeholder={placeholder}
                        />
                    </label>
                    <button type="submit">Click to play!</button>
                </form>
                <Link to="https://github.com/GuillaumeDnt2/Trivia99/tree/main">
                    <button type="button">GitHub<img src={github} alt="GitHub"/></button>
                </Link>
        </BaseLayout>
}