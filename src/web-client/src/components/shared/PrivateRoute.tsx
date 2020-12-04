import { Redirect, Route, RouteProps, useLocation } from "react-router";
import { useGame } from "../../hooks/useGame";

export default function PrivateRoute({ children, ...rest }: RouteProps) {
  const { state } = useGame();
  const location = useLocation();

  if (state.player.id === undefined) {
    return (
      <Redirect to={{
        pathname: '/login',
        state: { from: location }
      }}
      />
    )
  }

  return <Route {...rest}>{children}</Route>;
}