import { useHistory } from "react-router";
import { createUuid } from '../../helpers/identifiers'
  
export default function Dashboard() {
  const history = useHistory();

  function createGame() {
    const gameId = createUuid();
    history.push(`/game/${gameId}`);
  }

  return (
    <div className="wrapper wrapper--centered">
      <h1>Orlog</h1>
      <button onClick={() => createGame()}>Create game</button>
      <button>Join game</button>
    </div>
  );
}
