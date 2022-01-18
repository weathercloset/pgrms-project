import { createContext } from 'react';
import {
  LOGIN,
  SIGNUP,
  LOGOUT,
  LOADING_ON,
  LOADING_OFF,
  GET_CURRENT_USER,
  FOLLOW_USER,
  UNFOLLOW_USER,
  SET_NOTIFICATIONS,
} from './types';
import { getLikesMap } from './utils';

export const initialAuthData = {
  currentUser: {
    uid: null,
    email: null,
    username: null,
    fullName: null,
    followers: [],
    following: [],
    notifications: [],
    messages: [],
    likes: [],
    likesMap: {},
  },
  isLoading: false,
};

export const AuthContext = createContext(initialAuthData);

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case LOGIN: {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          uid: payload.user._id,
          email: payload.user.email,
          profileImage: payload.user.image,
          username: payload.user.username,
          fullName: payload.user.fullName,
          followers: payload.user.followers,
          following: payload.user.following,
          notifications: [],
          messages: payload.user.messages,
          likes: payload.user.likes,
          likesMap: getLikesMap(payload.user.likes),
        },
      };
    }
    case SIGNUP: {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          uid: payload.user._id,
          email: payload.user.email,
          profileImage: payload.user.image,
          username: payload.user.username,
          fullName: payload.user.fullName,
          followers: payload.user.followers,
          following: payload.user.following,
          notifications: [],
          messages: payload.user.messages,
          likes: payload.user.likes,
          likesMap: getLikesMap(payload.user.likes),
        },
      };
    }
    case LOGOUT: {
      return {
        ...state,
        currentUser: { ...initialAuthData },
      };
    }
    case GET_CURRENT_USER: {
      return {
        ...state,
        currentUser: {
          uid: payload._id,
          email: payload.email,
          profileImage: payload.image,
          username: payload.username,
          fullName: payload.fullName,
          followers: payload.followers,
          following: payload.following,
          notifications: [],
          messages: payload.messages,
          likes: payload.likes,
          likesMap: getLikesMap(payload.likes),
        },
      };
    }
    case SET_NOTIFICATIONS: {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifications: payload || [],
        },
      };
    }
    case FOLLOW_USER: {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          following: [
            ...state.currentUser.following,
            {
              _id: payload.followId,
              follower: state.currentUser.uid,
              user: payload.userId,
            },
          ],
        },
      };
    }
    case UNFOLLOW_USER: {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          following: state.currentUser.following.filter(
            (following) => following._id !== payload.unfollowId,
          ),
        },
      };
    }
    case LOADING_ON: {
      return { ...state, isLoading: true };
    }
    case LOADING_OFF: {
      return { ...state, isLoading: false };
    }
    default: {
      return state;
    }
  }
};
