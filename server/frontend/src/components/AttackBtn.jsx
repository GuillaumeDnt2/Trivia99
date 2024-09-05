import "../styles/AttackBtn.css";
import { socket } from "../utils/socket";

/**
 * Button to send an attack
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
 * @returns {JSX.Element}
*/
export default function AttackBtn(props) {

    /**
     * Send an attack request to the server
     */
    function attack(){
        socket.emit("attack");
    }

    return (
        <button id='attack-button' onClick={attack} disabled={!props.canAttack}>Attack</button>
    );
}