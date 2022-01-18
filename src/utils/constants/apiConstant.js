export const API_METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
};

export const WEATHER_API = {
  LATITUDE: 37.56,
  LONGITUDE: 126.97,
  UNITS: 'metric',
  CITY: 'seoul',
  EXCLUDE: 'minutely,hourly,alerts',
};

export const WEATHER_NAME = {
  Clear: '맑음',
  Thunderstorm: '뇌우',
  Drizzle: '이슬비',
  Rain: '비',
  Snow: '눈',
  Smoke: '스모그',
  Mist: '박무',
  Haze: '연무',
  Dust: '황사',
  Fog: '안개',
  Sand: '먼지',
  Ash: '화산재',
  Squall: '스콜',
  Tornado: '토네이도',
  Clouds: '구름',
  none: '날씨정보 없음',
};

export const EVALUATION_EMOJI = {
  hot: '🥵',
  cold: '🥶',
  good: '🤩',
};

export const WEATHER_API_CALL_CYCLE = 30 * 60 * 1000;
