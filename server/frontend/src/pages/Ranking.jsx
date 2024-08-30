import { useEffect, useState } from "react"
import { socket } from "../utils/socket";
import BaseLayout from "../components/BaseLayout";
import "../styles/Ranking.css"
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
            setRanking(sentRanking);
        }

        socket.on("ranking", onRanking);

        return () => {
            socket.off("ranking");
        }
    }, []);

    return <BaseLayout>
        <div className={"content-column-box padding-20px"}>
            <div className={"center-text"}>
                <h2>{ranking[0]?.playerName} won!</h2>
            </div>
            <div>
            <div className={"item-ranking"}>
                <span className={"rank-r"}>Rank</span>
                <span className={"name-r"}>Name</span>
                <span className={"nb-quest-r"}>Nb questions</span>
                <span className={"accu-r"}>Accuracy</span>
            </div>
            <div className="scroll-box disable-scrollbar">
                <div className={"list-ranking"}>
                    {ranking.map((player) =>
                        <div className={"item-ranking " + (player.rank % 2 !== 0 ? "colored-r" : "")}>
                            <span className={"rank-r"}>{player.rank}</span>
                            <span className={"name-r"}>{player.playerName}</span>
                            <span className={"nb-quest-r align-center-text"}>{player.answeredQuestions}</span>
                            <span
                                className={"accu-r"}>{(player.goodAnswers / (player.badAnswers + player.goodAnswers) * 100).toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </div>
            </div>
            <button className={"orange-button"} type={"button"} onClick={handleReturnHome}>Return to home page</button>
        </div>
    </BaseLayout>
}