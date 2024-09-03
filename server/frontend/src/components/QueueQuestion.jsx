import {useEffect, useState} from "react";

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