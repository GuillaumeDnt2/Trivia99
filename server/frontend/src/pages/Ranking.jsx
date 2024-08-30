import { useEffect, useState } from "react"
import { socket } from "../utils/socket";
import BaseLayout from "../components/BaseLayout";
import {useNavigate} from "react-router-dom";

export default function Ranking(){

    const navigate = useNavigate()

    const [ranking, setRanking] = useState([]);

    const handleReturnHome = () => {
        socket.emit("deleteUser")
        navigate("/")
    }

    useEffect(() => {
        function onRanking(sentRanking){
            console.log(sentRanking);
            setRanking(sentRanking);
            socket.off("ranking");
        }

        socket.on("ranking", onRanking);

        socket.emit("getRanking");

    }, []);

    return <BaseLayout>
                    <h2>{ranking[0]?.playerName} won!</h2>
                    <h3>Ranking: </h3>
                    <div className="scroll-box">
                        <ul>
                            {ranking.map(player =>
                                <li>{player.playerName} : {player.goodAnswers} answered correctly</li>
                            )}
                        </ul>
                    </div>
                    <button type={"button"} onClick={handleReturnHome}>Return to home page</button>
            </BaseLayout>
}