import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { Icon, Avatar, Badge } from '../../base';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigationContext } from '../../../contexts/NavigationContext';

const TopNavigation = () => {
  const {
    navigationProps: {
      isBack,
      isNotifications,
      isProfile,
      title,
      isMenu,
      isNext,
      handleClickBack,
      handleClickNext,
    },
  } = useNavigationContext();

  const { pathname } = useLocation();
  const subPath = pathname.split('/')[2];
  const [isBlur, setIsBlur] = useState(false);
  const containerRef = useRef(null);
  const { currentUser } = useAuth();

  const history = useHistory();

  useEffect(() => {
    const defaultTemplateContainer = document.getElementById('default-template-container');
    const handleScroll = () => {
      if (containerRef.current.offsetTop > 56) {
        setIsBlur(true);
      } else {
        setIsBlur(false);
      }
    };
    defaultTemplateContainer.addEventListener('scroll', handleScroll);
    return () => {
      defaultTemplateContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Container isBlur={isBlur} ref={containerRef}>
      <Wrapper>
        <IconGroup>
          {isBack && (
            <CursorIcon name="chevron-left" size={24} onClick={handleClickBack || history.goBack} />
          )}
        </IconGroup>
        <IconGroup>
          {isNotifications && (
            <Badge
              count={currentUser.notifications.filter((notification) => !notification?.seen).length}
              maxCount={10}
            >
              <Link to="/notifications">
                <Icon name="bell" size={24} />
              </Link>
            </Badge>
          )}
          {isProfile && currentUser.username && (
            <Link to={`/user/${currentUser.username}`}>
              <Avatar
                size={32}
                src={
                  currentUser.profileImage ||
                  'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                }
              />
            </Link>
          )}
          {isMenu && currentUser.username && (
            <Link to={`/user/${currentUser.username}/menu`}>
              <Icon name="menu" size={24} />
            </Link>
          )}
          {handleClickNext && isNext && currentUser.username && (
            <NextButton onClick={handleClickNext}>다음</NextButton>
          )}
        </IconGroup>
      </Wrapper>
      <TitleWrapper>
        <Title>
          {title || (currentUser.username === subPath ? currentUser.username : subPath)}
        </Title>
      </TitleWrapper>
    </Container>
  );
};

const Container = styled.nav`
  padding-top: 2px;
  z-index: 1000;
  position: sticky;
  top: 0;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    height: 56px;
    background: ${({ theme }) => theme.colors.white};
    box-shadow: 0 0 32px rgba(0, 0, 0, 0.1);
    transition: opacity 200ms;
    opacity: ${({ isBlur }) => (isBlur ? 1 : 0)};
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  padding: 0 16px;
`;

const TitleWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  display: block;
  width: 60%;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: 700;
  pointer-events: none;
`;

const IconGroup = styled.div`
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CursorIcon = styled(Icon)`
  cursor: pointer;
`;

const NextButton = styled.div`
  padding: 12px;
  font-weight: 700;
`;

export default TopNavigation;
