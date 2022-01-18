/* eslint no-unused-vars: "warn" */

import { createContext } from 'react';
import { SET_SOCKET, CLEAR_SOCKET } from './types';

export const initialData = {
  socket: null,
};

export const Context = createContext(initialData);

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case SET_SOCKET: {
      return { ...state, socket: payload.socketInstance };
    }
    case CLEAR_SOCKET: {
      return { ...initialData };
    }
    default: {
      return state;
    }
  }
};
