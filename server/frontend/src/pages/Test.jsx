import BaseLayout from "../components/BaseLayout";
import Stack from "../components/Stack";

export default function Test(){
    return(
        <BaseLayout>
        <Stack state={[{attack : false, difficulty : "easy"}, {attack : false, difficulty : "medium"}, {attack : false, difficulty : "hard"}, {attack : true, difficulty : "easy"}, {attack : true, difficulty : "medium"}]}></Stack>
        </BaseLayout>
        )
}