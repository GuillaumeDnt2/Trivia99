import BaseLayout from "../components/BaseLayout";
import PlayerList from "../components/PlayerList";
import Stack from "../components/Stack";
import Stats from "../components/Stats";
import QuestAndAnsw from "../components/QuestAndAnsw";
import "../styles/common.css"

export default function Zebi(){

    return (
        <BaseLayout>
            <div className="content-row-box hsize">
                <PlayerList players={["lksjd","dsfdfs","sdfdsf","sfwefef","SFF","dafaf"]}/>
                <div id="content-column-box">
                    <Stack state={[
    {
      "id": 1,
      "difficulty": "easy",
      "isAttack": false
    },
    {
      "id": 2,
      "difficulty": "hard",
      "isAttack": true
    }
  ]} />
                    <Stats streak={123} accuracy={0.231} nbReponse={145}/>
                    <QuestAndAnsw isAlive={true} q={"Which of these Latin phrases means 'Words fly away, writings remain'?"} a={["Incepto ne desistam","Dies irae","Verba volant, scripta manent","Barba non facit philosophum"]}/>
                </div>
                <PlayerList players={["lksjd","dsfdfs","sdfdsf","sfwefef","SFF","dafaf"]}/>
            </div>   
        </BaseLayout>
    );

}