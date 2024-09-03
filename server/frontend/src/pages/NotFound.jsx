import "../styles/common.css"
import BaseLayout from "../components/BaseLayout";


export default function NotFound(){
    return (
        <BaseLayout>
            <div className={"padding-20px"}>
                <h1 className={"text"}>This page does not exist X﹏X</h1>
            </div>
        </BaseLayout>
    );
}