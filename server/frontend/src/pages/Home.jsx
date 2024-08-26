import "./Home.css"
import {socket} from "../utils/socket.js"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom"
import logo from '../assets/Trivia99.png'

export default function Home(){


    const [name, setName] = useState("");
    const [placeholder, setPlaceholder] = useState("Enter your name")

    const navigate = useNavigate();

    function handleSubmit() {
        console.log("A")
        /*
        if(name.length !== 0){
            socket.send(
                //TODO Message login
            )
            //navigate("/waiting");
        }else{
            //TODO set placeholder color to red
            setPlaceholder("You must enter a name to continue...")
        }
         */
    }

    return (
        <div className="center-inside-div">
            <div className="content-column-box">
                <img src={logo} alt="Trivia99" className="logo" />
                    <form className="content-column-box">
                        <label>Username
                            <input
                                type="text"
                                onChange={(e) => setName(e.target.value)}
                                placeholder={placeholder}
                                onSubmit={handleSubmit}
                            />
                            <button type="submit">Click to play!</button>
                        </label>
                    </form>
            </div>
        </div>
    );
}