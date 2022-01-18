import React from 'react';
import AuthProvider from './AuthContext';
import SocketProvider from './SocketContext';
import NavigationProvider from './NavigationContext';
import PostProvider from './PostProvider';
import WeatherProvider from './WeatherProvider';

const ContextProviders = ({ children }) => {
  return (
    <AuthProvider>
      <SocketProvider>
        <NavigationProvider>
          <WeatherProvider>
            <PostProvider>{children}</PostProvider>
          </WeatherProvider>
        </NavigationProvider>
      </SocketProvider>
    </AuthProvider>
  );
};

export default ContextProviders;
