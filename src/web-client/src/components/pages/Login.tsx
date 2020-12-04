import { useEffect } from "react";
import { useHistory } from "react-router";

import { useGame } from "../../hooks/useGame";

/**
 * This component doesnt really login a user for now, but it assigns
 * a unique identifier as well as give a randomly generated username.
 */
export default function Login() {
  const {
    init,
    state: { player },
  } = useGame();
  const history = useHistory<{ from: { pathname: string } }>();

  useEffect(() => {
    init();
  });

  useEffect(() => {
    if (player.id) {
      history.push(history.location.state ? history.location.state.from : "/");
    }
  }, [player, history]);

  return null;
}
