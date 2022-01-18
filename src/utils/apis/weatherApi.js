import axios from 'axios';
import { API_METHOD, WEATHER_API } from '../constants/apiConstant';
import { onFulfilled, onRejected } from './common';
import { yesterdayDateToUTC } from '../functions/dateUtil';

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = process.env.REACT_APP_WEATHER_API_END_POINT;

axiosInstance.interceptors.response.use(onFulfilled, onRejected);

const request = async (options) => {
  return axiosInstance(options);
};

export const getNowWeather = () => {
  return request({
    method: API_METHOD.GET,
    url: '/onecall',
    params: {
      appid: process.env.REACT_APP_WEATHER_API_KEY,
      lat: WEATHER_API.LATITUDE,
      lon: WEATHER_API.LONGITUDE,
      units: WEATHER_API.UNITS,
      exclude: WEATHER_API.EXCLUDE,
    },
  });
};

export const getYesterdayWeather = () => {
  return request({
    method: API_METHOD.GET,
    url: '/onecall/timemachine',
    params: {
      appid: process.env.REACT_APP_WEATHER_API_KEY,
      lat: WEATHER_API.LATITUDE,
      lon: WEATHER_API.LONGITUDE,
      units: WEATHER_API.UNITS,
      dt: yesterdayDateToUTC(),
    },
  });
};
