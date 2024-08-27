import "../styles/Stack.css";
import StackQuestion from "./StackQuestion";

export default function Stack(props){

    const squareQ = []

    for(let i = 0; i < props.state.length; i++){
        let currQ = props.state.at(i)
        squareQ.push(<StackQuestion attack={currQ.attack} difficulty={currQ.difficulty} />)
    }

    return (
        <div className={'stack-box'}>
            {squareQ}
        </div>
    );
}