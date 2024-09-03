import '../styles/common.css'
import '../styles/QuestAndAnsw.css'
import { socket } from '../utils/socket'
import {useEffect, useState} from "react";

export default function QuestAndAnsw(props){

    const [isTimeout, setIsTimeout] = useState(false);
    const [bad, setBad] = useState([false,false,false,false]);
    const [waiting, setWaiting] = useState(true);
    const [lastAnswer, setLastAnswer] = useState(null);
    const [answers, setAnswers] = useState([]);

    function sendAnswer(val){
        setLastAnswer(val);
        socket.emit("answer", val);
    }

    useEffect(() => {
        function onBadAnswer(){
            setIsTimeout(true);
            setBad(bad.map((val, key) => key === lastAnswer ? true : val));
            setTimeout(() => setIsTimeout(false), 2000);
        }

        function onGoodAnswer(){
            setBad([false,false,false,false]);
        }

        function onNoMoreQuestions(){
            setWaiting(true);
            setAnswers(["","","",""]);
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
        setAnswers(props.a);
        let color;
        if(props.atk){
            color = 'var(--attack)';
        } else {
            color = `var(--${props.difficulty})`;
        }
        let borders = document.getElementsByClassName("question-color");
        for(let border of borders){
            console.log("Change color");
            border.style.borderColor = color;
        }
        
    }, [props.difficulty, props.atk, props.q, props.a])


    return (<div className='content-column-box'>
            {props.isAlive ? (
            <div>
                {
                    waiting ? (<h3>Waiting for question...</h3>)
                    : <h3 className='question-text'>{props.q}</h3>
                }
                <div className='answers-grid orange-border question-color'>
                    {answers.map((answer, key) =>
                                <button className='answer-cell question-color' key={'Answ'+ key}
                                        onClick={() => sendAnswer(key)}
                                        disabled={isTimeout || bad[key]}
                                        >{answer}
                                </button>
                    )}
                </div>
            </div>

            ) : (
            <div className='centered'>
                    <h3>You lost !</h3>
                    <h4>{"Rank #" + props.rank}</h4>
            </div>
            )}
        </div>)





/*
            {props.isAlive ? (
                waiting ? (
                    <h3>Waiting for question...</h3>
                    ) : (

                <>
                <h3 className='question-text'>{props.q}</h3>
                ) +
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
                : (
                <div className='centered'>
                    <h3>You lost !</h3>
                    <h4>{"Rank #" + props.rank}</h4>
                </div>
            )
        }        
        </div>*/
}