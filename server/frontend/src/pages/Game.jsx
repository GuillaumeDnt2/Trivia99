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

export default function Game(){
    const [playersLeft, setPlayersLeft] = useState([]);
    const [playersRight, setPlayersRight] = useState([]);

    const [queue, setQueue] = useState([]);
    const [streak, setStreak] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [nbResponse, setNbResponse] = useState(0);
    const [isAlive, setAlive] = useState(true);
    const [canAttack, setCanAttack] = useState(false);
    const [rank, setRank] = useState(0);

    const [question, setQuestion] = useState("");
    const [answers, setAnswers] = useState([]);
    const [attak, setAttack] = useState(false);
    const [difficulty, setDifficulty] = useState("easy");

    const navigate = useNavigate();

    useEffect(() => {

        function onUserInfo(userInfo) {
            console.log("Our user info questions: ")
            console.log(userInfo.questions);
            setAlive(userInfo.isAlive);
            setStreak(userInfo.streak);
            setAccuracy(userInfo.nbGoodAnswers / (userInfo.nbGoodAnswers + userInfo.nbBadAnswers));
            setNbResponse(userInfo.nbGoodAnswers);
            setCanAttack(userInfo.canAttack);



            setQueue(userInfo.questions);
            console.log("State of queue: ")
            console.log(queue)
            console.log(userInfo.questions);
        }

        function onNewQuestion(question){
            setQuestion(question.question.text);
            setAnswers(question.answers);
            setAttack(question.isAttack);
            setDifficulty(question.difficulty);
            console.log(question);
        }

        function onElimination(player){
            console.log("elimination");
            document.getElementById(player)?.classList.add("eliminated");
        }

        function onPlayers(players){
            console.log("Players");
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
        
        function onEndGame(){
            navigate("/ranking");
        }

        function onGameOver(data){
            setRank(data.rank);
        }

        socket.on("userInfo", onUserInfo);
        socket.on("newQuestion", onNewQuestion);
        socket.on("elimination", onElimination);
        socket.on("players", onPlayers);
        socket.on("endGame", onEndGame);
        socket.on("gameOver", onGameOver);

        console.log("emit all");
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
                    <QuestAndAnsw isAlive={isAlive} q={question} a={answers} atk={question.isAttack} difficulty={question.difficulty} rank={rank}/>
                    <AttackBtn canAttack={canAttack}/>
                </div>
                <PlayerList col="col3" players={playersRight}/>
            </div>   
        </BaseLayout>
    );
}