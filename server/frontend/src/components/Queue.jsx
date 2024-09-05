import "../styles/Queue.css";
import QueueQuestion from "./QueueQuestion";

/**
 * Box containing the square representing the questions 
 * in the queue
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
 * @returns {JSX.Element}
*/
export default function Queue(props){
    return (
        <div className='stack-box orange-border'>
            {props.state?.map((currQ, ind) =>
                <QueueQuestion key={'queue'+ ind} attack={currQ.isAttack} difficulty={currQ.difficulty} />
            )}
        </div>
    );
}