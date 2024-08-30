import "../styles/common.css";
import "../styles/PlayerList.css";

export default function PlayerList(props){
    // 1 lines of 1 player
    // 2 lines of 2 players
    // 13 lines of 3 players
    // 2 lines of 2 players
    // 1 line of 1 player

    //const list = props.map(player => <li id={player}>player</li>)

    function displayColumn(colId){
      return props.players?.map((plyr, key) => 
        key % 4 === colId ? <span id={plyr} className="dot tooltip">
          <span className="tooltiptext">{plyr}</span>
          </span> 
        : null
      )
    }

    return (
      <div className={"content-row-box orange-border " + props.col}>
          <div className="column">
              {displayColumn(0)}
          </div>
          <div className="column">
              {displayColumn(1)}
          </div>
          <div className="column">
              {displayColumn(2)}
          </div>
          <div className="column">
              {displayColumn(3)}
          </div>
      </div>
    );
}