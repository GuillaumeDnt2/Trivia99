import BaseLayout from "../components/BaseLayout";

export default function About(){
    return <BaseLayout>
        <h2 id="top">What is Trivia 99?</h2>
        <p>
            Trivia 99 is a battle royal game with up to 99 players. To survive, you have to answer multiple choice trivia questions. But be careful, if you wait for to long, some questions will add up to your question's queue and if the queue number exceeds 7, you lose the game! Try to chain the right answers to grow your streak and attack your friends.
        </p>
        <h3 id="queue">The questions queue</h3>
        <p>The question queue represents the future questions you will have to answered. The maximum of questions you can have in your queue is <b>7</b>. When the 8th question arrives, you lose the game.
        At the beginning of the game, the questions arrive every 10 seconds. However the time between each question will shorten as the time pass and they will arrive quicker and quicker.</p>
        <p>In the queue, the color of the questions represtents their difficulty:</p>
        <ul>
            <li style={{color: "var(--easy)"}}>Green: easy</li>
            <li style={{color: "var(--medium)"}}>Blue: medium</li>
            <li style={{color: "var(--hard)"}}>Violet: hard</li>
            <li style={{color: "var(--attack)"}}>Red: Attack from an other player (also hard)</li>
        </ul>
        <h3 id="answers">The answers</h3>
        <p>Each questions has 4 possible answer but only one is correct. If you click </p>
        <h3 id="streak">The streak and the attack</h3>
        <p>The streak is the number of correct answers without a bad one. When the streak reach <b>3</b>, you may attack the other players by pressing the "attack" button. It will send a hard question to random players. The number of sent question depends of the streak, a streak of 3 will send 1 questions,  4 will send 2 questions, 5 will send 3 questions and so on ...</p>
        <p>Attacking resets your streak to 0. So you have the choice, either grow your streak to attack more people or securing your attack before a wrong answer.</p>
    </BaseLayout>
}