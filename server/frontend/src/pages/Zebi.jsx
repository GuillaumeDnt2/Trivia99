import BaseLayout from "../components/BaseLayout";
import PlayerList from "../components/PlayerList";
import Queue from "../components/Queue";
import Stats from "../components/Stats";
import QuestAndAnsw from "../components/QuestAndAnsw";
import "../styles/common.css";
import AttackBtn from "../components/AttackBtn";
import "../styles/Game.css";

export default function Zebi(){

    return (
        <BaseLayout>
            <div className="content-row-box switch-vertical main-container">
                <PlayerList col="col1" players={["lksjd","dsfdfs","sdfdsf","sfwefef","SFF","dafaf"]}/>
                <div className="content-column-box col2 game-container">
                    <Stats streak={12} accuracy={0.23187769} nbReponse={145}/>
                    <Queue state={[
    {
      "id": 1,
      "difficulty": "easy",
      "isAttack": false
    },
    {
      "id": 2,
      "difficulty": "medium",
      "isAttack": false
    },
    {
      "id": 3,
      "difficulty": "hard",
      "isAttack": false
    },
    {
      "id": 3,
      "difficulty": "hard",
      "isAttack": true
    }
  ]} />
                    <QuestAndAnsw isAlive={true} rank={99} q={"Which of these Latin phrases means 'Words fly away, writings remain' aslkjdldlsdjlksasjlasld jsadlskdlkADLSKDALDSKDLSAKJ LADLKSDLKASLKDJSLDK  SALJLDLKFlklgsjl trrtrgre ngagoigersadddd ddddddddddddd dddddddddd dddddd ddddd ddddddddd dddddddddddd?"} a={["Incepto ne desistamddddd ddddddddddddddddddddddddd ddddddddddd dddddddddddddd","Dies irasdaaaaaa aaaaaaaaaaaaaaa aaaa aaaaaaaaaaaaaaaaa aaae","Verba volanddddd dddddddddddd dddddd ddddddddddd ddddddddddd ddddddd ddddddddddd ddddddd ddddt, scripta maneddddddd dddddddddddddddddd ddddddddddd dddddddd dddddd dddddddddddddddddddddddddnt","Bddddddddddddddddddddddddddddddddddd dddddddddddddddddddddddddarba non facit philosophum"]} atk={false} difficulty={'hard'}/>
                    <AttackBtn canAttack={false}/>
                </div>
                <PlayerList col="col3" right={true} players={["lksjd","dsfdfs","sdfdsf","sfwefef","SFF","dafaf","lksjd","dsfdfs","sdfdsf","sfwefef","SFF","dafaf","lksjd","dsfdfs","sdfdsf","sfwefef","SFF","dafaf","lksjd","dsfdfs","sdfdsf","sfwefef","SFF","dafaf","lksjd","dsfdfs","sdfdsf","sfwefef","SFF","dafaf","lksjd","dsfdfs","sdfdsf","sfwefef","SFF","dafaf"]}/>
            </div>   
        </BaseLayout>
    );

}