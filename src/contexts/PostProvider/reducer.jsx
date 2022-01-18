import { createContext } from 'react';

export const PostContext = createContext();

export const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT_POSTS': {
      return action.payload;
    }
    case 'ADD_POST': {
      return [...state, action.payload];
    }
    case 'DELETE_POST': {
      const { payload } = action;
      return state.filter((item) => item.id !== payload.id);
    }
    default: {
      console.error('Wrong type');
      break;
    }
  }
};
