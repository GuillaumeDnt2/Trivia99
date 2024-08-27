import BaseLayout from "../components/BaseLayout";
import Stats from "../components/Stats";

export default function Zebi(){
    return <BaseLayout>
        <Stats streak={12} accuracy={0.76521} nbReponse={15}/>
    </BaseLayout>
}