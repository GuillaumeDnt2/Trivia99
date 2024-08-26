import "./Home.css"
import {socket} from "../utils/socket.js"
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom"
import logo from '../assets/Trivia99.png'
import github from '../assets/github-mark.svg'

export default function Home(){

    const [name, setName] = useState("");
    const [placeholder, setPlaceholder] = useState("Enter your name")

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault()
        if(name.length !== 0){
            socket.emit(
                'login',
                {name: name}
            )
            navigate('/waiting')
        }else {
            document.querySelector("input").style.setProperty("--c", "red");
            setPlaceholder("You must enter a name...")
        }
    }

    return (
        <div className="center-inside-div">
            <div className="content-column-box">
                <img src={logo} alt="Trivia99" className="logo" />
                <form onSubmit={handleSubmit} className="content-column-box">
                    <label>Username
                        <input
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            placeholder={placeholder}
                        />
                    </label>
                    <button type="submit">Click to play!</button>
                    <Link to="https://github.com/GuillaumeDnt2/Trivia99/tree/main" >
                        <button type="button">GitHub<img src={github} alt="GitHub" /></button>
                    </Link>
                </form>
            </div>
        </div>
    );
}