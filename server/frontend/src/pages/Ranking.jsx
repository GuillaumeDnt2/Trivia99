import { useEffect, useState } from "react"
import { socket } from "../utils/socket";
import BaseLayout from "../components/BaseLayout";

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

    return <BaseLayout>
            <div className={"content-column-box center"}>
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
            </BaseLayout>
}