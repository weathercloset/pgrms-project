/* eslint no-unused-vars: "off" */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'react-lottie';
import styled from '@emotion/styled';
import { useForm } from '../hooks';
import { Spinner, Toast, Input } from '../components/base';
import { useAuth } from '../contexts/AuthContext';
import { Button, ErrorMessage, Form, H1, PageContainer, TitleContainer } from './SignupPage';
import fireworks from '../assets/lotties/fireworks.json';
import { useNavigationContext } from '../contexts/NavigationContext';

const LoginPage = () => {
  const { onMountPage, pageTypes } = useNavigationContext();
  const { onLogin, isLoading: authIsLoading } = useAuth();
  const { values, errors, isLoading, handleChange, handleSubmit } = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      await onLogin(values);
    },
    validate: ({ email, password }) => {
      const errors = {};
      if (!/^.+@.+\..+$/.test(email)) errors.email = '올바른 이메일 형식으로 적어주세요.';
      if (!email) errors.email = '이메일을 적어주세요.';
      if (!password) errors.password = '비밀번호을 적어주세요.';

      if (Object.keys(errors).length > 0) Toast.show('안내 메시지에 맞게 적어주세요 🤔', 3000);
      return errors;
    },
  });

  useEffect(() => onMountPage(pageTypes.LOGIN_PAGE), []);

  return (
    <PageContainer>
      <TitleContainer>
        <LottieWrapper>
          <Lottie
            options={{
              loop: false,
              autoplay: true,
              animationData: fireworks,
              rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice',
              },
            }}
            height={400}
            width={400}
          />
        </LottieWrapper>
        <H1>
          날씨에
          <br />
          맞는 옷을
          <br />더 빠르게
        </H1>
      </TitleContainer>

      <Form action="submit" onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          placeholder="이메일을 적어주세요"
        />
        <ErrorMessage>{errors && errors.email}</ErrorMessage>
        <Input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="비밀번호를 적어주세요"
        />
        <ErrorMessage>{errors && errors.email}</ErrorMessage>
        <Button type="submit" disabled={isLoading || authIsLoading}>
          {isLoading || authIsLoading ? <Spinner /> : '로그인'}
        </Button>
      </Form>
      <Link to="/signup">회원가입하러가기</Link>
    </PageContainer>
  );
};

const LottieWrapper = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  pointer-events: none;
`;

export default LoginPage;
