import '../styles/common.css';
import '../styles/BaseLayout.css'
import logo from "../assets/Trivia99.png";

/**
 * Background with the logo
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
 * @returns {JSX.Element}
*/
export default function BaseLayout(props){
    return  <div className={'content-column-box background center gap-20px'}>
                <img className={'logo'} src={logo} alt="Trivia 99 logo" />
                <div className={'rounded-box shadow'}>
                    {props.children}
                </div>
            </div>
}