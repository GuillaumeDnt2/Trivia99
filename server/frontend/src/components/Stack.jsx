import "../styles/Stack.css";
import StackQuestion from "./StackQuestion";

export default function Stack(props){
    return (
        <div className='stack-box orange-border'>
            {props.state?.map((currQ, key) => 
                <StackQuestion key={'stack'+key} attack={currQ.attack} difficulty={currQ.difficulty} />
            )}
        </div>
    );
}