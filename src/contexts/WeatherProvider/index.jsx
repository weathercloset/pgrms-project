import { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import { reducer, initialState } from './reducer';
import { GET_WEATHER, LOADING, ERROR } from './types';
import { getWeatherInformation } from '../../utils/functions/weatherUtil';
import { WEATHER_API_CALL_CYCLE } from '../../utils/constants/apiConstant';
import { Toast } from '../../components/base';

const WeatherContext = createContext();
export const useWeatherContext = () => useContext(WeatherContext);

const WeatherProvider = ({ children }) => {
  const [weatherInformation, dispatch] = useReducer(reducer, initialState || {});

  const getWeather = useCallback(async () => {
    dispatch({ type: LOADING });
    const payload = await getWeatherInformation();

    if (payload.error?.message) {
      Toast.show(payload.error.message, 3000);
      dispatch({ type: ERROR, payload });
    } else {
      dispatch({ type: GET_WEATHER, payload });
    }
  }, []);

  const intervalId = useRef();
  useEffect(() => {
    getWeather();

    intervalId.current = setInterval(async () => {
      await getWeather();
    }, WEATHER_API_CALL_CYCLE);

    return () => {
      clearInterval(intervalId.current);
    };
  }, [getWeather]);

  return (
    <WeatherContext.Provider value={{ weatherInformation, getWeather }}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherProvider;
