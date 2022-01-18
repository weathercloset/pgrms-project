import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import { v4 } from 'uuid';
import ToastItem from './ToastItem';

const Container = styled.div`
  position: fixed;
  bottom: 16px;
  right: 16px;
  left: 16px;
  z-index: 3000;
`;

const ToastManager = ({ bind }) => {
  const [toasts, setToasts] = useState([]);

  const createToast = useCallback((message, duration, isProgressBar) => {
    const newToast = {
      id: v4(),
      message,
      duration,
      isProgressBar,
    };
    setToasts((oldToasts) => [...oldToasts, newToast]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((oldToasts) => oldToasts.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    bind(createToast);
  }, [bind, createToast]);

  return (
    <Container>
      {toasts.map(({ id, message, duration, isProgressBar }) => (
        <ToastItem
          isProgressBar={isProgressBar}
          message={`${message}`}
          duration={duration}
          key={id}
          onDone={() => removeToast(id)}
        />
      ))}
    </Container>
  );
};

export default ToastManager;
