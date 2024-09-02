import {useEffect, useState} from "react";

export default function QueueQuestion(props){

    const [color, setColor] = useState("");

    useEffect(() =>{

        if(props.attack){
            setColor("red")
        }else{
            switch(props.difficulty){
                case "easy":
                    setColor("green")
                    break;
                case "medium":
                    setColor("blue")
                    break;
                case "hard":
                    setColor("black")
                    break;
                default:
                    throw new Error();
            }
        }
    }, [props]);

    return (
        <div className={`square ${color}`}></div>
    );
}