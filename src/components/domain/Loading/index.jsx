import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

const Loading = ({ logo }) => {
  const [isInit, setIsInit] = useState(false);

  useEffect(() => {
    setIsInit(true);
    return () => setIsInit(false);
  }, []);

  return (
    <Wrapper isInit={isInit}>
      <LoadingWrapper>
        <LoadingLogo src={logo} alt="loading_logo" />
        <div style={{ fontSize: 20, fontWeight: 500, letterSpacing: 5 }}>
          당신의 온도는 몇°C인가요?
        </div>
      </LoadingWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: absolute;
  z-index: 8000;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, ${({ isInit }) => (isInit ? 0.85 : 0)});
  backdrop-filter: ${({ isInit }) => (isInit ? `blur(12px)` : 0)};

  transition: all 100ms;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3vh;

  animation: 3s slidein infinite;

  @keyframes slidein {
    0% {
      margin-bottom: 12px;
      transform: scale(100%);
      opacity: 0.8;
    }

    30% {
      margin-bottom: 24px;
      transform: scale(104%);
      opacity: 0.9;
    }

    100% {
      margin-bottom: 12px;
      transform: scale(100%);
      opacity: 0.8;
    }
  }
`;
const LoadingLogo = styled.img`
  width: 12vh;
  height: 12vh;
`;

export default Loading;
