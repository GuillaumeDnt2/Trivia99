

export default function PlayerList({props}){
    // 1 lines of 1 player
    // 2 lines of 2 players
    // 13 lines of 3 players
    // 2 lines of 2 players
    // 1 line of 1 player

    const list = props.map(player => <li id={player}>player</li>)

    return (
      <ul>
          {list}
      </ul>
    );
}