import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const webSocketTypes = {
  CREATE_NOTIFICATION_REQUEST: 'CREATE_NOTIFICATION_REQUEST',
  CREATE_NOTIFICATION: 'CREATE_NOTIFICATION',
};

export const notificationTypes = {
  COMMENT: 'COMMENT',
  FOLLOW: 'FOLLOW',
  LIKE: 'LIKE',
  MESSAGE: 'MESSAGE',
};

const useSocket = ({ token = '', onConnected = () => {}, onError = () => {} }) => {
  const [socket, setSocket] = useState(null);

  const createNotificationRequest = useCallback((notifications) => {
    console.log(webSocketTypes.CREATE_NOTIFICATION_REQUEST, notifications);
  }, []);

  useEffect(() => {
    const socketInstance = io(
      `${process.env.REACT_APP_SNS_API_END_POINT}${token ? `?token=${token}` : ''}`,
      {
        transports: ['websocket'],
        withCredentials: true,
      },
    );
    setSocket(socketInstance);
    return () => socketInstance.disconnect();
  }, [token]);

  useEffect(() => {
    socket?.on('connect', () => {
      onConnected();
      console.log('socket.connected', socket.connected);
      console.log('socket.id', socket.id);
    });

    socket?.on('connect_error', () => {
      onError();
      console.log('connect_error');
    });

    socket?.on(webSocketTypes.CREATE_NOTIFICATION_REQUEST, createNotificationRequest);
  }, [socket]);

  return [socket];
};

export default useSocket;
