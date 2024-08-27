import "./NotFound.css"
import logo from '../assets/Trivia99.png'


export default function NotFound(){
    return (
        <div className="center-inside-div">
            <div className="content-column-box">
                <img src={logo} alt="Trivia99logo" className="logo"/>
                <p>
                    <h1>This page does not exist X﹏X</h1>
                </p>
            </div>
        </div>
    );
}