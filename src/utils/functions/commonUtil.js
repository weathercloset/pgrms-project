export const isEmptyObject = (obj = {}) => {
  return Object.keys(obj).length === 0;
};

export const jsonParse = (json) => {
  try {
    const obj = JSON.parse(json);
    return obj;
  } catch (error) {
    return {};
  }
};

export const jsonStringify = (obj) => {
  try {
    const stringify = JSON.stringify(obj);
    return stringify;
  } catch (error) {
    return '';
  }
};

export const getMetaData = (meta) => {
  return jsonParse(meta || '{}');
};

export const getStyleMapByMeta = (metaString) => {
  const {
    brightness = 100,
    contrast = 100,
    position = 'center',
    saturate = 100,
    grayscale = 0,
  } = getMetaData(metaString);
  return {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) grayscale(${grayscale}%)`,
    backgroundPosition: `${position}%`,
  };
};
