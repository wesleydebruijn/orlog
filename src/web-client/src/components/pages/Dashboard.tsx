import { useEffect } from "react";
import { useHistory } from "react-router";
import { v4 as uuidv4 } from "uuid";

import { useWebsocket } from "../../hooks/useWebsocket";

export default function Dashboard() {
  const history = useHistory();
  const { init } = useWebsocket();

  function createGame() {
    const gameId = uuidv4();
    history.push(`/game/${gameId}`);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="wrapper wrapper--centered">
      <h1>Orlog</h1>
      <button onClick={() => createGame()}>Create game</button>
      <button>Join game</button>
    </div>
  );
}
