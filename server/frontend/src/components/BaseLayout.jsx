import '../styles/common.css';
import '../styles/BaseLayout.css'
import logo from "../assets/Trivia99.png";

export default function BaseLayout(props){
    return  <div className={'content-column-box background center gap-20px'}>
                <img className={'logo'} src={logo} alt="Trivia 99 logo" />
                <div className={'rounded-box shadow'}>
                    {props.children}
                </div>
            </div>
}