import {useEffect, useState} from "react";
import {socket} from "../utils/socket";
import "../components/PlayerList"
import PlayerList from "../components/PlayerList";
import BaseLayout from "../components/BaseLayout";
import Queue from "../components/Queue";
import Stats from "../components/Stats";
import QuestAndAnsw from "../components/QuestAndAnsw";
import "../styles/common.css";
import {useNavigate} from "react-router-dom";
import "../styles/Game.css";
import AttackBtn from "../components/AttackBtn";

/**
 * Main page of the game
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
 * @returns {JSX.Element}
*/
export default function Game(){
    const [playersLeft, setPlayersLeft] = useState([]); // Players in the left column
    const [playersRight, setPlayersRight] = useState([]);// Players in the right column

    const [queue, setQueue] = useState([]);             // Questions in the queue
    const [streak, setStreak] = useState(0);            // Streak of the player
    const [accuracy, setAccuracy] = useState(0);        // Accuracy of the player
    const [nbResponse, setNbResponse] = useState(0);    // Score of the player
    const [isAlive, setAlive] = useState(true);         // Determine if the player is alive
    const [canAttack, setCanAttack] = useState(false);  // True when the player has a streak big enough to attack
    const [rank, setRank] = useState(0);                // Rank when eliminated

    const [question, setQuestion] = useState("");       // Text of the question
    const [answers, setAnswers] = useState([]);         // Text of the answers
    const [attack, setAttack] = useState(false);
    const [difficulty, setDifficulty] = useState("easy");// Difficulty of the actual question

    const navigate = useNavigate();

    useEffect(() => {

        /**
         * Parse the data receive in the userInfo message
         * @param {*} userInfo 
         */
        function onUserInfo(userInfo) {
            setAlive(userInfo.isAlive);
            setStreak(userInfo.streak);
            setAccuracy(userInfo.nbGoodAnswers === 0 ? 0 : userInfo.nbGoodAnswers / (userInfo.nbGoodAnswers + userInfo.nbBadAnswers));
            setNbResponse(userInfo.nbGoodAnswers);
            setCanAttack(userInfo.canAttack);
            setQueue(userInfo.questions);
        }

        /**
         * Parse the received question
         * @param {*} question 
         */
        function onNewQuestion(question){
            setQuestion(question.question.text);
            setAnswers(question.answers);
            setAttack(question.isAttack);
            setDifficulty(question.difficulty);
        }

        /**
         * Change the color of the dot representing the eliminated player
         * @param {string} player 
         */
        function onElimination(player){
            document.getElementById(player)?.classList.add("eliminated");
        }

        /**
         * Dispatch the players in both columns
         * @param {*} players 
         */
        function onPlayers(players){
            let plyrLeft = [];
            let plyrRight = [];
            for(let i = 0; i < players.length; ++i){
                if(i%2 === 0){
                    plyrLeft.push(players[i].name);
                } else {
                    plyrRight.push(players[i].name);
                }
            }
            setPlayersLeft(plyrLeft);
            setPlayersRight(plyrRight);
        }
        
        /**
         * Navigate to the ranking
         */
        function onEndGame(){
            socket.emit("getGameStatus")
            socket.emit("isUserLogged")
            navigate("/ranking");
        }

        /**
         * Set the rank of the player
         * @param {*} data 
         */
        function onGameOver(data){
            setAlive(false);
            setRank(data);
        }

        socket.on("userInfo", onUserInfo);
        socket.on("newQuestion", onNewQuestion);
        socket.on("elimination", onElimination);
        socket.on("players", onPlayers);
        socket.on("endGame", onEndGame);
        socket.on("gameOver", onGameOver);
        
        // Get the data of the player
        socket.emit("getAllInfo");

        return () => {
            socket.off("userInfo");
            socket.off("newQuestion");
            socket.off("elimination");
            socket.off("players");
            socket.off("endGame");
            socket.off("gameOver");
        }
    }, []);

    
    return (
        <BaseLayout>
            <div className="content-row-box switch-vertical main-container">
                <PlayerList col="col1" players={playersLeft}/>
                <div className="content-column-box col2 game-container">
                    <Queue state={queue} />
                    <Stats streak={streak} accuracy={accuracy} nbReponse={nbResponse}/>
                    <QuestAndAnsw isAlive={isAlive} q={question} a={answers} atk={attack} difficulty={difficulty} rank={rank}/>
                    <AttackBtn canAttack={canAttack}/>
                </div>
                <PlayerList col="col3" players={playersRight}/>
            </div>   
        </BaseLayout>
    );
}