import "../styles/AttackBtn.css";
import { socket } from "../utils/socket";

export default function AttackBtn(props) {

    function attack(){
        socket.emit("attack");
    }

    return (
        <button id='attack-button' onClick={attack} disabled={!props.canAttack}>Attack</button>
    );
}