import '../styles/common.css';
import '../styles/Stats.css';
import flame from '../assets/flame.png';
import { useEffect } from 'react';
import {socket} from "../utils/socket";

export default function Stats(props){

    useEffect(() => {
        const btn = document.getElementById('attack-button');
        btn.disabled = !props.canAttack;
    }, [props.streak, props.canAttack])

    function attack(){
        socket.emit("attack");
    }

    return <div className='content-row-box'>
            <div className='content-row-box rounded-box orange-fade'>
                <div className='content-column-box spaced'>
                    <h3>Score</h3>
                    <p>{props.nbReponse}</p>
                </div>
                <div className='content-column-box spaced'>
                    <h3>Accuracy</h3>
                    <p>{props.accuracy}</p>
                </div>
                <div className='spaced'>
                    <h3>Streak</h3>
                    <div className='img-container'>
                        <img id='flame-img' src={flame} alt='flame'/>
                        <p className='img-text'>{props.streak}</p>
                    </div>
                </div>
                
            </div>
            
            <button id='attack-button' className='red-fade' onClick={attack}>Attack</button>
        </div>
        
        
}