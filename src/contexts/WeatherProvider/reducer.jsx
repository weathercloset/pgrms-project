import { GET_WEATHER, ERROR, LOADING } from './types';

export const initialState = {
  weather: {},
  error: {},
  isError: false,
  isLoading: true,
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING: {
      return { ...state, isLoading: true, isError: false };
    }
    case GET_WEATHER: {
      return { ...state, weather: action.payload, isLoading: false, isError: false };
    }
    case ERROR: {
      return { ...state, weather: {}, error: action.payload, isLoading: false, isError: true };
    }
    default: {
      return state;
    }
  }
};
