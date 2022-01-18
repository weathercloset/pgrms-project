import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { useForm } from '../hooks';
import { Spinner, Toast, Input } from '../components/base';
import { useAuth } from '../contexts/AuthContext';
import { useNavigationContext } from '../contexts/NavigationContext';

const SignupPage = () => {
  const { onMountPage, pageTypes } = useNavigationContext();
  const { onSignup, isLoading: authIsLoading } = useAuth();
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      email: '',
      password: '',
      fullName: '',
      username: '',
    },
    onSubmit: async (values) => {
      await onSignup(values);
    },
    validate: ({ email, password, fullName, username }) => {
      const errors = {};
      if (!/^.+@.+\..+$/.test(email)) errors.email = '올바른 이메일 형식으로 적어주세요';
      if (!email) errors.email = '이메일을 적어주세요';
      if (!password) errors.password = '비밀번호을 적어주세요';
      if (!fullName) errors.fullName = '이름을 적어주세요';
      if (!username) errors.username = '닉네임을 적어주세요';

      if (Object.keys(errors).length > 0) Toast.show('안내 메시지에 맞게 적어주세요 🤔', 3000);
      return errors;
    },
  });

  useEffect(() => onMountPage(pageTypes.SIGNUP_PAGE), []);

  return (
    <PageContainer>
      <TitleContainer>
        <H1>
          날씨의 옷장
          <br />
          웨더클로젯에
          <br />
          합류하세요
        </H1>
      </TitleContainer>
      <Form action="submit" onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          value={values.email}
          placeholder="이메일을 적어주세요"
          onChange={handleChange}
        />
        <ErrorMessage>{errors.email}</ErrorMessage>
        <Input
          type="password"
          name="password"
          value={values.password}
          placeholder="비밀번호를 적어주세요"
          onChange={handleChange}
        />
        <ErrorMessage>{errors.password}</ErrorMessage>
        <Input
          type="text"
          name="fullName"
          value={values.fullName}
          placeholder="사용자의 이름을 적어주세요"
          onChange={handleChange}
        />
        <ErrorMessage>{errors.fullName}</ErrorMessage>
        <Input
          type="text"
          name="username"
          value={values.username}
          placeholder="고유한 닉네임을 적어주세요"
          onChange={handleChange}
        />
        <ErrorMessage>{errors.username}</ErrorMessage>
        <Button type="submit" disabled={isLoading || authIsLoading}>
          {isLoading || authIsLoading ? <Spinner /> : '회원가입'}
        </Button>
      </Form>

      <Link to="/login">로그인하러가기</Link>
    </PageContainer>
  );
};

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 95%;
`;

export const TitleContainer = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const H1 = styled.h1`
  font-size: 46px;
  font-weight: 100;
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.grey600};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: calc(100% - 24px);
`;

export const ErrorMessage = styled.p`
  color: tomato;
  font-size: 12px;
  margin-left: 12px;
  margin-bottom: 12px;
`;

export const Button = styled.button`
  width: 100%;
  border: none;
  outline: none;
  padding: 16px 0;
  background: ${({ theme }) => theme.colors.grey600};
  color: ${({ theme }) => theme.colors.grey50};
  font-size: 16px;
  margin-bottom: 16px;
`;

export default SignupPage;
