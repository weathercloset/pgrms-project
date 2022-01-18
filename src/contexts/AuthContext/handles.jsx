import { useHistory } from 'react-router-dom';
import { useCallback } from 'react';
import { useLocalToken } from '../../routes/utilRoutes/hooks';
import { getCurrentUser, login, signup } from '../../utils/apis/snsApi';
import { Toast } from '../../components/base';
import { initialAuthData } from './reducer';

const useHandles = () => {
  const [localToken, setLocalToken] = useLocalToken();
  const history = useHistory();

  const handleGetCurrentUser = useCallback(async () => {
    const { data } = await getCurrentUser(localToken);
    if (!data?._id) {
      if (localToken) Toast.show('인증 정보가 변경되었거나 무효해요. 다시 로그인해주세요 🤔');
      setLocalToken('');
      localStorage.clear();
      history.replace('/login');
    }
    return data;
  }, [localToken]);

  const handleLogin = useCallback(
    async (form) => {
      setLocalToken('');
      localStorage.clear();

      const { data = { token: null, user: null }, error } = await login(form);
      const { token, user } = data;

      if (!error.code) {
        setLocalToken(token);
        history.replace('/');
        Toast.show('웨더클로젯에 다시 오셨네요~! 🥳 반가워요', 3000);
      } else if (error.code === 400) {
        Toast.show('적어주신 아이디와 비밀번호를 확인해주세요 🤔', 3000);
      }

      return { token, user };
    },
    [setLocalToken, history],
  );

  const handleSignup = useCallback(
    async (form) => {
      setLocalToken('');
      localStorage.clear();

      const {
        data = {
          token: null,
          user: initialAuthData,
        },
        error,
      } = await signup(form);
      if (!error.code) {
        setLocalToken(data.token);
        history.replace('/');
        Toast.show('웨더클로젯에 합류하셨어요🥳 어서오세요!', 3000);
      } else if (error.code === 500) {
        Toast.show('username 중복이 있는 것 같다. 아닐수도!?', 3000);
      } else {
        Toast.show(error.message, 3000);
      }
      return data;
    },
    [setLocalToken, history],
  );

  const handleLogout = useCallback(() => {
    setLocalToken('');
    localStorage.clear();
    history.replace('/login');
  }, [setLocalToken]);

  return { handleGetCurrentUser, handleLogin, handleSignup, handleLogout };
};

export default useHandles;
