import React from "react";
import { Redirect, Route } from "react-router";
import auth from "../services/authService";

function ProtectedRoute(props) {
  const { path, component: Component, render, ...rest } = props;

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!auth.getCurrentUser())
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
}

export default ProtectedRoute;
