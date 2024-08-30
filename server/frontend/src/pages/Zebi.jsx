import BaseLayout from "../components/BaseLayout";
import PlayerList from "../components/PlayerList";
import Stack from "../components/Stack";
import Stats from "../components/Stats";
import QuestAndAnsw from "../components/QuestAndAnsw";
import "../styles/common.css"
import AttackBtn from "../components/AttackBtn";

export default function Zebi(){

    return (
        <BaseLayout>
            <div className="content-row-box switch-vertical hsize">
                <PlayerList col="col1" players={["lksjd","dsfdfs","sdfdsf","sfwefef","SFF","dafaf"]}/>
                <div id="content-column-box col2">
                    <Stats streak={123} accuracy={0.231} nbReponse={145}/>
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
                    <QuestAndAnsw isAlive={true} q={"Which of these Latin phrases means 'Words fly away, writings remain'?"} a={["Incepto ne desistam","Dies irae","Verba volant, scripta manent","Barba non facit philosophum"]}/>
                    <AttackBtn/>
                </div>
                <PlayerList col="col3" players={["lksjd","dsfdfs","sdfdsf","sfwefef","SFF","dafaf"]}/>
            </div>   
        </BaseLayout>
    );

}