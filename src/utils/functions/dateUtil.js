export const nowDateToUTC = () => {
  const now = new Date();
  return (
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds(),
    ) / 1000
  );
};

export const yesterdayDateToUTC = () => {
  return nowDateToUTC() - 24 * 60 * 60;
};

export const convertDateFormat = (date, seperator) => {
  const currentDate = new Date(date);
  const year = currentDate.getFullYear();
  const month = `0${1 + currentDate.getMonth()}`.slice(-2);
  const day = `0${currentDate.getDate()}`.slice(-2);

  return `${year}${seperator}${month}${seperator}${day}`;
};
