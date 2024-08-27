import {useEffect, useState} from "react";
import {socket} from "../utils/socket";
import "../components/PlayerList"
import PlayerList from "../components/PlayerList";
import BaseLayout from "../components/BaseLayout";
import Stack from "../components/Stack";
import Stats from "../components/Stats";

export default function Game(){
    const [playersLeft, setPlayersLeft] = useState([]);
    const [playersRight, setPlayersRight] = useState([]);

    const [stack, setStack] = useState([]);
    const [streak, setStreak] = useState(0);
    const [accuracy, setAccuracy] = useState(0)
    const [nbResponse, setNbResponse] = useState(0)

    const [question, setQuestion] = useState({});

    useEffect(() => {

        function onUserInfo(userInfo) {
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
              <PlayerList props={playersLeft}/>
              <div id="center-content">
                  <Stack state={stack} />
                  <Stats streak={streak} accuracy={accuracy} nbReponse={nbResponse}/>
                  <p id="question">
                      {question}
                  </p>
                  <div id="responses">

                  </div>
              </div>
              <PlayerList props={playersRight}/>
        </BaseLayout>
    );
}