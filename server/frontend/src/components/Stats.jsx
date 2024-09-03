import '../styles/common.css';
import '../styles/Stats.css';
import flame from '../assets/flame.png';

export default function Stats(props){

    return(
        <div className='content-row-box orange-border stat-container'>
            <div className='content-column-box spaced'>
                <h3>Score</h3>
                <p class="centered">{props.nbReponse}</p>
            </div>
            <div className='content-column-box spaced'>
                <h3>Accuracy</h3>
                <p class="centered">{(props.accuracy * 100).toFixed(2) + "%"}</p>
            </div>
            <div className='spaced'>
                <h3>Streak</h3>
                <div className='img-container'>
                    <img id='flame-img' src={flame} alt='flame'/>
                    <p className='img-text'>{props.streak}</p>
                </div>
            </div>
        </div>
    );
        
}