import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { Icon, Modal } from '../components/base';
import { useAuth } from '../contexts/AuthContext';
import { useNavigationContext } from '../contexts/NavigationContext';

const UserMenuPage = () => {
  const { onMountPage, pageTypes } = useNavigationContext();
  const { onLogout } = useAuth();

  const [logOutModalVisible, setLogOutModalVisible] = useState(false);

  useEffect(() => {
    onMountPage(pageTypes.USER_MENU_PAGE);
  }, []);

  const list = [
    { id: '1', title: '다크 모드', onClick: () => console.log('dark Mode clicked'), icon: 'user' },
    { id: '2', title: '로그아웃', onClick: () => setLogOutModalVisible(true), icon: 'bell' },
  ];

  return (
    <div>
      <MenuList>
        {list.map(({ title, onClick, icon, id }) => (
          <MenuItem key={id} onClick={onClick}>
            <Icon name={icon} /> {title}
          </MenuItem>
        ))}
      </MenuList>
      <Modal
        maxWidth="90vw"
        backgroundColor="white"
        visible={logOutModalVisible}
        onClose={() => setLogOutModalVisible(false)}
      >
        <ModalQuestion>정말 로그아웃 하시나요? 🤔</ModalQuestion>
        <ModalBottomButtonContainer>
          <Button border type="button" onClick={() => setLogOutModalVisible(false)}>
            취소
          </Button>
          <Button type="button" onClick={onLogout}>
            로그아웃하기
          </Button>
        </ModalBottomButtonContainer>
      </Modal>
    </div>
  );
};

const MenuList = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.grey100};
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  transition: background 200ms;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey50};

  &:hover {
    background: ${({ theme }) => theme.colors.grey100};
  }
  &:focus {
    background: ${({ theme }) => theme.colors.grey200};
  }
  &:active {
    background: ${({ theme }) => theme.colors.grey300};
  }
`;

const ModalQuestion = styled.div`
  font-size: 16px;
  padding: 40px 0;
`;

const ModalBottomButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const Button = styled.button`
  font-size: 16px;
  font-weight: 700;
  flex: 1;
  display: block;
  outline: none;
  padding: 16px 28px;
  border: 1px solid ${({ theme, border }) => (border ? theme.colors.grey200 : theme.colors.grey800)};
  color: ${({ theme, border }) => (border ? theme.colors.grey600 : theme.colors.white)};
  background: ${({ theme, border }) => (border ? theme.colors.white : theme.colors.grey800)};
`;

export default UserMenuPage;
