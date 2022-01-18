import { useContext, useCallback, useReducer } from 'react';
import { reducer, Context, initialData } from './reducer';
import { SET_NAVIGATION_EVENT, CLEAR_NAVIGATION_EVENT } from './eventTypes';
import * as pageTypes from './types';

export const useNavigationContext = () => useContext(Context);

const NavigationProvider = ({ children }) => {
  const [navigationProps, dispatch] = useReducer(reducer, initialData);

  const onMountPage = useCallback((pageType = null) => {
    dispatch({ type: pageType });
  }, []);

  const setNavigationEvent = useCallback(
    (events = { back: null, next: null }) =>
      dispatch({ type: SET_NAVIGATION_EVENT, payload: events }),
    [],
  );

  const clearNavigationEvent = useCallback(() => {
    dispatch({ type: CLEAR_NAVIGATION_EVENT });
  }, []);

  return (
    <Context.Provider
      value={{ navigationProps, pageTypes, onMountPage, setNavigationEvent, clearNavigationEvent }}
    >
      {children}
    </Context.Provider>
  );
};

export default NavigationProvider;
