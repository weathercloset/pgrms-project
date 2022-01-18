import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

import { TopNavigation, BottomNavigation } from '../components/domain';
import { useNavigationContext } from '../contexts/NavigationContext';

const DefaultTemplate = ({ children }) => {
  const {
    navigationProps: { isTopNavigation, isBottomNavigation },
  } = useNavigationContext();
  const [height, setHeight] = useState(window.innerHeight);

  const handleResize = () => {
    setHeight(window.innerHeight);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  return (
    <Container id="default-template-container" height={height}>
      {isTopNavigation && <TopNavigation />}
      <StyledMain>{children}</StyledMain>
      {isBottomNavigation && <BottomNavigation />}
    </Container>
  );
};

const StyledMain = styled.main`
  flex: 1;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-x: hidden;
  max-width: 640px;
  margin: auto;
  background-color: #fafafa;
  height: ${({ height }) => `${height}`}px;
  transition: height 200ms;
`;

export default DefaultTemplate;
