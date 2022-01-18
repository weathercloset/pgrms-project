import { getNowWeather, getYesterdayWeather } from '../apis/weatherApi';
import { WEATHER_NAME, EVALUATION_EMOJI } from '../constants/apiConstant';

export const getWeatherIconSrc = (iconName) =>
  `https://openweathermap.org/img/wn/${iconName}@2x.png`;

export const getTemperatureDifference = (todayTemp, yesterdayTemp) => {
  if (todayTemp > yesterdayTemp) {
    return `+${Math.abs(todayTemp - yesterdayTemp)}`;
  }

  if (todayTemp < yesterdayTemp) {
    return `-${Math.abs(todayTemp - yesterdayTemp)}`;
  }

  return 0;
};

export const makeRecommendationSentence = (differenceTemp) => {
  const absoluteTemperature = Math.abs(differenceTemp);
  const SimilarTemperatureSentence =
    '오늘은 어제와 비슷한 온도입니다.\n어제와 비슷하게 입으셔도 좋습니다. 😋';

  if (differenceTemp === 0 || absoluteTemperature <= 3) {
    return SimilarTemperatureSentence;
  }

  const isPositive = differenceTemp >= 0;
  const messages = {
    highAndLow: isPositive ? '높습니다.' : '낮습니다.',
    hotAndCold: isPositive ? '시원하게' : '따뜻하게',
    emoji: isPositive ? '😋' : '☺️',
  };

  return `오늘은 어제보다 ${absoluteTemperature}도 ${messages.highAndLow}\n${messages.hotAndCold} 입으시는 걸 추천합니다. ${messages.emoji}`;
};

export const getWeatherInformation = async () => {
  const nowWeather = await getNowWeather();
  const yesterdayWeather = await getYesterdayWeather();

  if (nowWeather.data && yesterdayWeather.data) {
    const { current: { temp: beforeTemp } = {} } = yesterdayWeather.data;
    const { current: { temp, weather = [{}] } = {}, daily = [{}] } = nowWeather.data;
    const { temp: { min, max } = {} } = daily[0];
    const { main, icon } = weather[0];
    const nowTemp = Math.round(temp) || 0;
    const yesterDayTemp = Math.round(beforeTemp) || 0;
    const differenceTemp = getTemperatureDifference(nowTemp, yesterDayTemp);

    return {
      icon,
      nowTemp,
      differenceTemp,
      minTemp: Math.round(min) || 0,
      maxTemp: Math.round(max) || 0,
      weatherName: WEATHER_NAME[main] || WEATHER_NAME.none,
      weatherIconSrc: getWeatherIconSrc(icon),
      recommendationSentence: makeRecommendationSentence(parseInt(differenceTemp, 10)),
    };
  }

  return { error: nowWeather?.error || yesterdayWeather?.error };
};

export const makeEvaluationEmoji = (meta = '{}') => {
  const nowMeta = JSON.parse(meta);
  return EVALUATION_EMOJI[nowMeta.evaluation] || '';
};

export const makeEvaluationEmojiMap = (metaMap = {}) => EVALUATION_EMOJI[metaMap.evaluation] || '';
