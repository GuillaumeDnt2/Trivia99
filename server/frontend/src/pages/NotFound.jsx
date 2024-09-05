import "../styles/common.css"
import BaseLayout from "../components/BaseLayout";

/**
 * Page to display when the address of a page is not found
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
 * @returns {JSX.Element}
*/
export default function NotFound(){
    return (
        <BaseLayout>
            <div className={"padding-20px"}>
                <h1 className={"text"}>This page does not exist X﹏X</h1>
            </div>
        </BaseLayout>
    );
}