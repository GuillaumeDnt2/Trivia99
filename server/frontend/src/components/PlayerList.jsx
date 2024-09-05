import "../styles/common.css";
import "../styles/PlayerList.css";

/**
 * Component to display the players in the game
 * 
 * @version 05.09.2024
 * 
 * @author Arthur Junod, Guillaume Dunant, Valentin Bonzon, Edwin Haeffner
 * @returns {JSX.Element}
*/
export default function PlayerList(props){

    /**
     * Display the people in a single
     * @param {Number} colId [0-3]
     * @returns 
     */
    function displayColumn(colId){
      return props.players?.map((plyr, key) => 
        key % 4 === colId ? <span id={plyr} className="dot tooltip" key={"Player"+plyr+key}>
          <span key={"tooltip"+plyr+key} className="tooltiptext">{plyr}</span>
          </span> 
        : null
      )
    }

    return (
      <div className={"content-row-box orange-border players-container " + props.col}>
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