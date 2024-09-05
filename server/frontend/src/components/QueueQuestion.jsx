import {useEffect, useState} from "react";

/**
 * Square representing the questions
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
 * @returns {JSX.Element}
*/
export default function QueueQuestion(props){

    const [color, setColor] = useState("");

    useEffect(() =>{

        if(props.attack){
            setColor("attack")
        }else{
            if(props.difficulty){
                setColor(props.difficulty);
            } else {
                throw new Error();
            }
        }
    }, [props]);

    return (
        <div className={`square ${color}`}></div>
    );
}