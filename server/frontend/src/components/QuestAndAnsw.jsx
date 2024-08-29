import '../styles/common.css'
import '../styles/QuestAndAnsw.css'
import { socket } from '../utils/socket'

export default function QuestAndAnsw(props){

    function sendAnswer(val){
        socket.emit("answer", val);
    }


    return <div className='content-column-box'>
            {props.isAlive ? (
                <>
                <h3>{props.q}</h3>
                <div className='answers-grid orange-border'>
                    {props.a?.map((answer, key) =>
                                <div className='answer-cell' key={'Answ'+key} 
                                onClick={() => sendAnswer(key)}>{answer}</div>
                    )}
                </div>
                </>
            ) : (
                <h3>You lost !</h3>
            )
        }        
        </div>
}