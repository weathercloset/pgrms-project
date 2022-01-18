import styled from '@emotion/styled';
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigationContext } from '../../../contexts/NavigationContext';
import { Icon } from '../../base';

const BottomNavigation = () => {
  const {
    navigationProps: { currentPage },
    pageTypes,
  } = useNavigationContext();

  const navIcons = [
    {
      to: '/',
      name: 'home',
      isCurrentPage: currentPage === pageTypes.HOME_PAGE,
    },
    {
      to: '/upload',
      name: 'plus-square',
      isCurrentPage: currentPage === pageTypes.UPLOAD_PAGE,
    },
    {
      to: '/explore',
      name: 'globe',
      isCurrentPage: currentPage === pageTypes.EXPLORE_PAGE,
    },
  ];

  return (
    <Container>
      <Wrapper>
        {navIcons.map(({ to, name, isCurrentPage }) => (
          <Link to={to} key={to}>
            <Icon name={name} size={24} color={isCurrentPage ? 'black' : '#cfcfcf'} />
          </Link>
        ))}
      </Wrapper>
    </Container>
  );
};

const Container = styled.nav`
  position: sticky;
  background: white;
  display: flex;
  align-items: center;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.1);
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  flex: 1;
`;

export default BottomNavigation;
