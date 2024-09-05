import '../styles/common.css'
import '../styles/QuestAndAnsw.css'
import { socket } from '../utils/socket'
import {useEffect, useState} from "react";

/**
 * Content to display the question and the answers. 
 * Can also wait for a new question or display the rank 
 * when the player is eliminated 
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
 * @returns {JSX.Element}
*/
export default function QuestAndAnsw(props){

    const [isTimeout, setIsTimeout] = useState(false);          // Timout when the player answer wrongly
    const [bad, setBad] = useState([false,false,false,false]);  // Save which answer are wrong
    const [waiting, setWaiting] = useState(true);               // True when the queue is empty
    const [lastAnswer, setLastAnswer] = useState(null);         // Save the last answer click when waiting for the server if good or bad
    const [answers, setAnswers] = useState([]);                 // Text of the answer

    /**
     * Send the answer clicked by the player to the server
     * @param {Number} val Answer's ID
     */
    function sendAnswer(val){
        setLastAnswer(val);
        socket.emit("answer", val);
    }

    useEffect(() => {

        /**
         * Save that the answer is wrong and timout for 2 sec
         */
        function onBadAnswer(){
            setIsTimeout(true);
            setBad(bad.map((val, key) => key === lastAnswer ? true : val));
            setTimeout(() => setIsTimeout(false), 2000);
        }

        /**
         * Reset the responses
         */
        function onGoodAnswer(){
            setBad([false,false,false,false]);
        }

        /**
         * Wait for an other question when the queue is empty
         */
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

    // When a new question arrives
    useEffect(() => {
        setWaiting(false);
        setAnswers(props.a);

        // Define the color to display
        let color;
        if(props.atk){
            color = 'var(--attack)';
        } else {
            color = `var(--${props.difficulty})`;
        }

        // Change the color of the borders
        let borders = document.getElementsByClassName("question-color");
        for(let border of borders){
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
}