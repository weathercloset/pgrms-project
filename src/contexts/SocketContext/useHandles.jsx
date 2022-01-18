import { useCallback } from 'react';
import { io } from 'socket.io-client';
import { useLocalToken } from '../../routes/utilRoutes/hooks';
import { SocketEvents } from './socketTypes';

const useHandles = () => {
  const [localToken] = useLocalToken();

  const getSocketInstance = useCallback(() => {
    return io(`${process.env.REACT_APP_SNS_API_END_POINT}?token=${localToken}`, {
      transports: ['websocket'],
      withCredentials: true,
    });
  }, [localToken]);

  const createNotificationRequest = useCallback((notifications) => {
    console.log(SocketEvents.CREATE_NOTIFICATION_REQUEST, notifications);
  });

  return { getSocketInstance, createNotificationRequest };
};

export default useHandles;
