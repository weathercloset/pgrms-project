import { useContext, useCallback, useReducer, useEffect } from 'react';
import { reducer, Context, initialData } from './reducer';
import { SET_SOCKET, CLEAR_SOCKET } from './types';
import { SocketEvents } from './socketTypes';
import useHandles from './useHandles';

export const useNavigationContext = () => useContext(Context);

const SocketProvider = ({ children }) => {
  const [{ socket }, dispatch] = useReducer(reducer, initialData);
  const { getSocketInstance, createNotificationRequest } = useHandles();

  const setSocket = useCallback(() => {
    const socketInstance = getSocketInstance();
    dispatch({ type: SET_SOCKET, payload: { socketInstance } });
  }, []);

  const clearSocket = useCallback(() => {
    dispatch({ type: CLEAR_SOCKET });
  }, []);

  useEffect(() => {
    setSocket();
    return () => {
      socket?.disconnect();
      clearSocket();
    };
  }, []);

  useEffect(() => {
    socket?.on('connect', () => console.log('socket.connected', socket.connected));
    socket?.on('connect_error', () => console.log('connect_error'));
    socket?.on(SocketEvents.CREATE_NOTIFICATION_REQUEST, createNotificationRequest);
    socket?.on(SocketEvents.CREATE_NOTIFICATION, createNotificationRequest);
  }, [socket]);

  console.log(socket);

  return <Context.Provider value={{ socket }}>{children}</Context.Provider>;
};

export default SocketProvider;
