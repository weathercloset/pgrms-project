import styled from '@emotion/styled';
import { useState, useEffect } from 'react';
import Text from '../Text';
import { useTimeout } from '../../../hooks';

const ToastItem = ({ message, duration, onDone, isProgressBar = false }) => {
  const [cssDetail, setCssDetail] = useState({
    isShow: false,
    isMove: false,
  });

  useEffect(() => {
    setCssDetail({ isShow: true, isMove: true });
  }, []);

  useTimeout(() => {
    setCssDetail({ isShow: false, isMove: true });
    setTimeout(() => onDone(), 400);
  }, duration);

  const { isShow, isMove } = cssDetail;

  return (
    <Container isShow={isShow} isMove={isMove}>
      {isProgressBar && <ProgressBar style={{ animationDuration: `${duration}ms` }} />}
      <Text>{message}</Text>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  min-height: 70px;
  padding: 0 20px;
  align-items: center;
  box-sizing: border-box;
  color: ${(props) => props?.theme?.colors?.grey800 || '#292929'};
  font-weight: 700;

  // Glassmorphism
  background: rgba(255, 255, 255, 0.4);
  text-shadow: 0 0px 48px rgba(255, 255, 255, 1), 0 0px 24px rgba(255, 255, 255, 1);
  box-shadow: inset 0 0 42px rgba(255, 255, 255, 0.6), 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 8px;
  overflow: hidden;

  // 애니메이션
  transition: all 200ms ease-out;
  opacity: ${({ isShow }) => (isShow ? 1 : 0)};
  margin: 0 0 ${({ isMove }) => (isMove ? 12 : -40)}px 0;
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 4px;
  background: ${(props) => props?.theme?.colors?.grey800 || '#292929'};
  box-shadow: 0 0px 32px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 0 -8px;
  animation-name: progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;

  @keyframes progress {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }
`;

export default ToastItem;
