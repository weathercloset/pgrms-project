import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useLocalToken } from '../hooks';

const PrivateRoute = ({ children, component: Component, ...rest }) => {
  const [localToken] = useLocalToken();

  return (
    <Route
      {...rest}
      render={(props) => (localToken ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

export default PrivateRoute;
