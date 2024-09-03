import '../styles/common.css'
import '../styles/QuestAndAnsw.css'
import { socket } from '../utils/socket'
import {useEffect, useState} from "react";

export default function QuestAndAnsw(props){

    const [isTimeout, setIsTimeout] = useState(false);
    const [bad, setBad] = useState([false,false,false,false]);
    const [waiting, setWaiting] = useState(false);
    const [answer, setAnswer] = useState(null);

    function sendAnswer(val){
        setAnswer(val);
        socket.emit("answer", val);
    }

    useEffect(() => {
        function onBadAnswer(){
            setIsTimeout(true);
            setBad(bad.map((val, key) => key === answer ? true : val));
            setTimeout(() => setIsTimeout(false), 2000);
        }

        function onGoodAnswer(){
            setBad([false,false,false,false]);
        }

        function onNoMoreQuestions(){
            setWaiting(true);
        }

        socket.on("badAnswer", onBadAnswer);
        socket.on("goodAnswer", onGoodAnswer);
        socket.on("noMoreQuestions", onNoMoreQuestions);

        return () => {
            socket.off("badAnswer");
            socket.off("goodAnswer");
            socket.off("noMoreQuestions");
        }
    })

    useEffect(() => {
        setWaiting(false);
        let color;
        if(props.atk){
            color = 'var(--attack)';
        } else {
            color = `var(--${props.difficulty})`;
        }

        let borders = document.getElementsByClassName("question-color");
        for(let border of borders){
            border.style.borderColor = color;
        }
        
    }, [props.q])


    return <div className='content-column-box'>
            {props.isAlive ? (
                waiting ? (
                    <h3>Waiting for question...</h3>
                    ) : (

                <>
                <h3 className='question-text'>{props.q}</h3>
                <div className='answers-grid orange-border question-color'>
                    {props.a?.map((answer, key) =>
                                <button className='answer-cell question-color' key={'Answ'+ key}
                                        onClick={() => sendAnswer(key)}
                                        disabled={isTimeout || bad[key]}
                                        >{answer}
                                </button>
                    )}
                </div>
                </>
                )) : (
                <div className='centered'>
                    <h3>You lost !</h3>
                    <h4>{"Rank #" + props.rank}</h4>
                </div>
            )
        }        
        </div>
}