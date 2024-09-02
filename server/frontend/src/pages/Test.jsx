import { useEffect, useState } from "react"
import { socket } from "../utils/socket";
import BaseLayout from "../components/BaseLayout";
import Queue from "../components/Queue";

export default function Ranking(){

    const [queue, setQueue] = useState([
        {
            "id": '31tge',
            "difficulty": 'easy',
            "isAttack": false
        },
        {
            "id": 'a323iji6',
            "difficulty": 'easy',
            "isAttack": true
        },
        {
            "id": 'asao4626i9941',
            "difficulty": 'easy',
            "isAttack": false
        },
        {
            "id": 'asooig2356oi9941',
            "difficulty": 'easy',
            "isAttack": false
        },
        {
            "id": 'asaffeg24ooigoi9941',
            "difficulty": 'easy',
            "isAttack": false
        }
    ]);

    return <BaseLayout>
        <div style={{width: "800px"}}>
            <Queue state={queue}/>
            <button type={"button"} onClick={() => {
                setQueue([
                    {
                        "id": 'a323iji6',
                        "difficulty": 'easy',
                        "isAttack": true
                    },
                    {
                        "id": 'asao4626i9941',
                        "difficulty": 'easy',
                        "isAttack": false
                    },
                    {
                        "id": 'asooig2356oi9941',
                        "difficulty": 'easy',
                        "isAttack": false
                    },
                    {
                        "id": 'asaffeg24ooigoi9941',
                        "difficulty": 'easy',
                        "isAttack": false
                    }])}
            } >Cool</button>
        </div>
    </BaseLayout>
}