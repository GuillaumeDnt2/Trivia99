import "../styles/common.css"
import logo from '../assets/Trivia99.png'


export default function NotFound(){
    return (
        <div className="content-column-box background">
            <img src={logo} alt="Trivia99logo" className="logo"/>
            <h1>This page does not exist X﹏X</h1>
        </div>
    );
}