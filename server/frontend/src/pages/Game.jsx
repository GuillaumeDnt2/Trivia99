import {useEffect, useState} from "react";
import {socket} from "../utils/socket";
import "../components/PlayerList"
import PlayerList from "../components/PlayerList";
import BaseLayout from "../components/BaseLayout";
import Stack from "../components/Stack";
import Stats from "../components/Stats";
import QuestAndAnsw from "../components/QuestAndAnsw";
import "../styles/common.css";

export default function Game(){
    const [playersLeft, setPlayersLeft] = useState([]);
    const [playersRight, setPlayersRight] = useState([]);

    const [stack, setStack] = useState([]);
    const [streak, setStreak] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const [nbResponse, setNbResponse] = useState(0);
    const [isAlive, setAlive] = useState(true);

    const [question, setQuestion] = useState({});

    useEffect(() => {

        function onUserInfo(userInfo) {
            setAlive(userInfo.isAlive);
            setStreak(userInfo.streak);
            setAccuracy(userInfo.nbGoodAnswers / (userInfo.nbGoodAnswers + userInfo.nbBadAnswers));
            setNbResponse(userInfo.nbGoodAnswers);
            setStack(userInfo.questions);
            console.log("userinfo");
        }

        function onNewQuestion(question){
            setQuestion(question);
            console.log(question);
        }

        function onElimination(player){
            document.getElementById(player).classList.add("eliminated");
            console.log("elimination")
        }

        function onPlayers(players){
            console.log(players);
            for(let i = 0; i < players.length; ++i){
                if(i%2 === 0){
                    setPlayersLeft([...playersLeft, players[i].name.name]);
                } else {
                    setPlayersRight([...playersRight, players[i].name.name]);
                }
            }
        }

        socket.on("userInfo", onUserInfo);
        socket.on("newQuestion", onNewQuestion);
        socket.on("elimination", onElimination);
        socket.on("players", onPlayers);

        socket.emit("getAllInfo");

        return () => {
            socket.off("userInfo");
            socket.off("newQuestion");
            socket.off("elimination");
            socket.off("players");

        }
    }, []);


    return (
        <BaseLayout>
            <div className="content-row-box">
                <PlayerList players={playersLeft}/>
                <div id="content-column-box">
                    <Stack state={stack} />
                    <Stats streak={streak} accuracy={accuracy} nbReponse={nbResponse}/>
                    <QuestAndAnsw isAlive={isAlive} q={question.question?.text} a={question.answers}/>
                </div>
                <PlayerList players={playersRight}/>
            </div>   
        </BaseLayout>
    );
}