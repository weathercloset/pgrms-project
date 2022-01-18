import React, { useEffect, useCallback, useState } from 'react';
import styled from '@emotion/styled';
import { useParams, useHistory } from 'react-router';
import { useLocalToken } from '../routes/utilRoutes/hooks';
import { changeUserName, changePassword, changeProfile } from '../utils/apis/snsApi';
import { useAuth } from '../contexts/AuthContext';
import { Avatar, Toast, Upload, Input } from '../components/base';
import { useForm } from '../hooks';
import { useNavigationContext } from '../contexts/NavigationContext';

const UserEditPage = () => {
  const { onMountPage, pageTypes } = useNavigationContext();
  const [token] = useLocalToken();
  const { userName } = useParams();
  const { currentUser, onGetCurrentUser } = useAuth();
  const history = useHistory();
  const [imageSrc, setImageSrc] = useState('');

  // 같은 사용자인지 체크하는 로직 context의 username과 params가 같은지
  const checkUser = useCallback(async () => {
    if (currentUser.username) {
      if (currentUser.username !== userName) history.push('/');
    }
  }, [userName, currentUser, history]);

  const onChangeUserData = async ({ image, fullName, username, password, checkPassword }) => {
    // 프로필 이미지 변경하는 로직
    if (image) {
      const data = { image };
      const response = await changeProfile(token, data);
      if (response.status === 200) {
        Toast.show('프로필 사진이 변경되었습니다.', 3000);
        onGetCurrentUser();
        history.replace(`/user/${username}`);
      } else if (response.error.code >= 300) {
        Toast.show(response.error.message, 3000);
      }
    }

    // 사용자 이름 변경하는 로직 변경하는 로직
    if (fullName && username) {
      if (currentUser.username !== username || currentUser.fullName !== fullName) {
        const response = await changeUserName(token, fullName, username);
        if (response.status === 200) {
          Toast.show('이름이 성공적으로 변경되었습니다.', 3000);
          onGetCurrentUser();
          history.replace(`/user/${username}`);
        } else if (response.error.code >= 300) {
          Toast.show(response.error.message, 3000);
        }
      }
    }

    // 사용자 비밀번호 변경하는 로직 변경하는 로직
    if (password && checkPassword) {
      const response = await changePassword(token, password);
      if (response.status === 200) {
        Toast.show('비밀번호가 성공적으로 변경되었습니다.', 3000);
        history.replace(`/user/${username}`);
      } else if (response.error.code >= 300) {
        Toast.show(response.error.message, 3000);
      }
    }
  };
  const FiletoDataURL = (file) => {
    const reader = new FileReader();
    if (file) {
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageSrc('');
    }
  };

  const handleImageSrc = (e) => {
    FiletoDataURL(e.target.files[0]);
  };
  const { values, errors, isLoading, handleChange, handleSubmit, setValues } = useForm({
    initialValues: {
      image: {},
      fullName: currentUser.fullName || '',
      username: currentUser.username || '',
      password: '',
      checkPassword: '',
    },
    onSubmit: async (value) => {
      await onChangeUserData(value);
    },
    validate: ({ fullName, username, password, checkPassword }) => {
      const errors = {};
      if (fullName || username) {
        if (!fullName) errors.fullName = 'fullName을 적어주세요';
        if (!username) errors.username = 'username을 적어주세요';
      }
      if (password || checkPassword) {
        if (password !== checkPassword) errors.checkPassword = '위 비밀번호가 다릅니다.';
        if (!password) errors.password = '비밀번호을 적어주세요';
        if (!checkPassword) errors.checkPassword = '비밀번호 확인을 적어주세요';
      }
      return errors;
    },
  });
  useEffect(() => {
    checkUser();
  }, [checkUser]);
  useEffect(() => {
    setValues({
      fullName: currentUser.fullName,
      username: currentUser.username,
    });
    setImageSrc(currentUser.profileImage || '');
  }, [checkUser, currentUser]);

  useEffect(() => onMountPage(pageTypes.USER_EDIT_PAGE), []);
  useEffect(() => {
    return () => setValues({});
  }, []);

  return (
    <UserEditContainer>
      <FormContainer onSubmit={handleSubmit}>
        <ProfileContainer>
          <Avatar src={imageSrc || ''} alt="profile" size={100} />
          <div>
            <Upload
              name="image"
              accept="image/*"
              onChange={(e) => {
                handleChange(e);
                handleImageSrc(e);
              }}
            >
              {(file) => <button type="button">{file ? file.name : '사진 선택하기'}</button>}
            </Upload>
          </div>
        </ProfileContainer>
        <EditNameWrapper>이름 변경하기</EditNameWrapper>
        <div>
          <div>이름 </div>
          <Input
            style={{ width: '100%', marginTop: '10px', boxSizing: 'border-box' }}
            type="text"
            name="fullName"
            placeholder="이름"
            onChange={handleChange}
            value={values.fullName || ''}
          />
          <ErrorParagraph>{errors.fullName}</ErrorParagraph>
        </div>
        <div>
          <div>닉네임 </div>
          <Input
            style={{ width: '100%', marginTop: '10px', boxSizing: 'border-box' }}
            type="text"
            name="username"
            placeholder="닉네임"
            onChange={handleChange}
            value={values.username || ''}
          />
          <ErrorParagraph>{errors.username}</ErrorParagraph>
        </div>
        <EditNameWrapper>비밀번호 변경하기</EditNameWrapper>
        <div>
          <div>비밀번호 </div>
          <Input
            style={{ width: '100%', marginTop: '10px', boxSizing: 'border-box' }}
            type="password"
            name="password"
            placeholder="새 비밀번호"
            onChange={handleChange}
            value={values.password || ''}
          />
          <ErrorParagraph>{errors.password}</ErrorParagraph>
        </div>
        <div>
          <div>비밀번호 확인 </div>
          <Input
            style={{ width: '100%', marginTop: '10px', boxSizing: 'border-box' }}
            type="password"
            name="checkPassword"
            placeholder="새 비밀번호 확인"
            onChange={handleChange}
            value={values.checkPassword || ''}
          />
          <ErrorParagraph>{errors.checkPassword}</ErrorParagraph>
        </div>
        <div>
          <ButtonContainer type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : '변경하기'}
          </ButtonContainer>
        </div>
      </FormContainer>
    </UserEditContainer>
  );
};

const UserEditContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const FormContainer = styled.form`
  margin-top: 30px;
  width: 75%;
`;
const EditNameWrapper = styled.p`
  font-weight: bold;
  font-size: 18px;
  line-height: 21px;
  margin: 10px 0;
`;
const ErrorParagraph = styled.p`
  color: red;
`;
const ButtonContainer = styled.button`
  margin-top: 20px;
  width: 100%;
  height: 53px;
  border: none;
  background-color: #d6d2cf;
`;
export default UserEditPage;
