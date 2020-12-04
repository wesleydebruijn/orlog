import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";

export default function Dashboard() {
  const history = useHistory();

  function createGame() {
    const gameId = uuidv4();
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
