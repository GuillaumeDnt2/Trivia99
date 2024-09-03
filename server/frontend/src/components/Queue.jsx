import "../styles/Queue.css";
import QueueQuestion from "./QueueQuestion";

export default function Queue(props){
    return (
        <div className='stack-box orange-border'>
            {props.state?.map((currQ, ind) =>
                <QueueQuestion key={'queue'+ ind} attack={currQ.isAttack} difficulty={currQ.difficulty} />
            )}
        </div>
    );
}