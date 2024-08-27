import { useEffect, useState } from "react"
import { socket } from "../utils/socket";

export default function Ranking(){

    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        function onRanking(sentRanking){
            setRanking(sentRanking);
        }

        socket.on("ranking", onRanking);

        return () => {
            socket.off("ranking");
        }
    }, []);

    return <div className="vertical">
                <img src="../../Trivia_99.png" alt="Trivia 99 logo"/>
                <div className="rounded-box">
                    <h2>{ranking[0]?.name} won!</h2>
                    <h3>Ranking: </h3>
                    <div className="scroll-box">
                        <ul>
                            {ranking.map(player =>
                                <li>{player.name} : {player.score} answered correctly</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
}