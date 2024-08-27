import '../styles/common.css';
import logo from "../assets/Trivia99.png";

export default function BaseLayout(props){
    return  <div className={'content-column-box background'}>
                <img className={'logo'} src={logo} alt="Trivia 99 logo" />
                <div className={'rounded-box'}>
                    {props.children}
                </div>
            </div>
}