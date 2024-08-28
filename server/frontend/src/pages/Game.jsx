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
        }

        function onNewQuestion(question){
            setQuestion(question)
        }

        function onElimination(player){
            document.getElementById(player).classList.add("eliminated");
        }

        socket.on("userInfo", onUserInfo);
        socket.on("newQuestion", onNewQuestion);
        socket.on("elimination", onElimination);

        return () => {
            socket.off("userInfo");
            socket.off("newQuestion");
            socket.off("elimination");
        }
    }, []);


    return (
        <BaseLayout>
            <div className="content-row-box">
                <PlayerList players={playersLeft}/>
                <div id="content-column-box">
                    <Stack state={stack} />
                    <Stats streak={streak} accuracy={accuracy} nbReponse={nbResponse}/>
                    <QuestAndAnsw isAlive={isAlive} q={question.question} a={question.answers}/>
                </div>
                <PlayerList players={playersRight}/>
            </div>   
        </BaseLayout>
    );
}