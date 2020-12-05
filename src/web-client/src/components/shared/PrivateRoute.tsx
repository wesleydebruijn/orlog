import { Redirect, Route, RouteProps, useLocation } from "react-router";
import { useAuth } from "../../hooks/useAuth";

export default function PrivateRoute({ children, ...rest }: RouteProps) {
  const { state: { user } } = useAuth();
  const location = useLocation();

  if (user === undefined) {
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
