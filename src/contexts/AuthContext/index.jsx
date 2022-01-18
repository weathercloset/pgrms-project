import { useContext, useCallback, useReducer, useEffect } from 'react';
import logo from '../../assets/logo/logo_line.png';
import { Loading } from '../../components/domain';
import {
  LOGIN,
  LOGOUT,
  LOADING_ON,
  LOADING_OFF,
  GET_CURRENT_USER,
  SIGNUP,
  FOLLOW_USER,
  UNFOLLOW_USER,
  SET_NOTIFICATIONS,
} from './types';
import { reducer, AuthContext, initialAuthData } from './reducer';
import useHandles from './handles';
import { useLocalToken } from '../../routes/utilRoutes/hooks';
import { setNotificationSeen, getNotifications } from '../../utils/apis/snsApi';

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [localToken] = useLocalToken();
  const [{ currentUser, isLoading }, dispatch] = useReducer(reducer, initialAuthData);
  const { handleGetCurrentUser, handleLogin, handleSignup, handleLogout } = useHandles();

  const onGetNotifications = useCallback(async () => {
    dispatch({ type: LOADING_ON });
    const { data, error } = await getNotifications(localToken);
    if (error.code === null) {
      dispatch({ type: SET_NOTIFICATIONS, payload: data });
    }
    dispatch({ type: LOADING_OFF });
  }, [localToken]);

  const onLogin = useCallback(
    async (data) => {
      dispatch({ type: LOADING_ON });
      const userData = await handleLogin(data);
      if (userData.token) {
        dispatch({ type: LOGIN, payload: userData });
        await onGetNotifications();
      }
      dispatch({ type: LOADING_OFF });
    },
    [handleLogin],
  );

  const onSignup = useCallback(
    async (data) => {
      dispatch({ type: LOADING_ON });
      const userData = await handleSignup(data);
      dispatch({ type: SIGNUP, payload: userData });
      await onGetNotifications();
      dispatch({ type: LOADING_OFF });
    },
    [handleSignup],
  );

  const onLogout = useCallback(async () => {
    dispatch({ type: LOADING_ON });
    handleLogout();
    dispatch({ type: LOGOUT });
    dispatch({ type: LOADING_OFF });
  }, [handleLogout]);

  const onGetCurrentUser = useCallback(async () => {
    dispatch({ type: LOADING_ON });
    if (localToken) {
      const userData = await handleGetCurrentUser();
      if (!userData?.user?._id) {
        dispatch({ type: GET_CURRENT_USER, payload: userData });
      }
      await onGetNotifications();
    }
    dispatch({ type: LOADING_OFF });
  }, [handleGetCurrentUser, localToken]);

  const onFollow = useCallback((payload = { userId: '', followId: '' }) =>
    dispatch({ type: FOLLOW_USER, payload }),
  );
  const onUnfollow = useCallback((payload = { unfollowId: '' }) =>
    dispatch({ type: UNFOLLOW_USER, payload }),
  );

  const onNotificationsSeen = useCallback(async () => {
    await setNotificationSeen(localToken);
  }, [localToken]);

  useEffect(() => onGetCurrentUser(), [onGetCurrentUser]);

  const firstPathName = [...window.location.pathname.split('/')][1];

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        onLogin,
        onSignup,
        onLogout,
        onGetCurrentUser,
        onFollow,
        onUnfollow,
        onNotificationsSeen,
        onGetNotifications,
      }}
    >
      <img
        src={logo}
        alt="logo"
        style={{ opacity: 0, width: 1, height: 1, position: 'absolute' }}
      />
      {isLoading && firstPathName !== 'notifications' && firstPathName !== 'user' && (
        <Loading logo={logo} />
      )}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
