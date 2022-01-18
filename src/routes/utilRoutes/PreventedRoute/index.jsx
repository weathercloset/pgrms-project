import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useLocalToken } from '../hooks';

const PreventedRoute = ({ children, component: Component, ...rest }) => {
  const [localToken] = useLocalToken();

  return (
    <Route
      {...rest}
      render={(props) => (localToken ? <Redirect to="/" /> : <Component {...props} />)}
    />
  );
};

export default PreventedRoute;
