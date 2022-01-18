/* eslint no-unused-vars: "warn" */

import { createContext } from 'react';
import {
  COMMENTS_PAGE,
  EXPLORE_PAGE,
  HOME_PAGE,
  LOGIN_PAGE,
  NOT_FOUND_PAGE,
  NOTIFICATIONS_PAGE,
  POST_PAGE,
  SIGNUP_PAGE,
  UPLOAD_PAGE,
  USER_EDIT_PAGE,
  USER_PAGE,
  USER_MENU_PAGE,
  USER_POSTS_PAGE,
} from './types';
import { SET_NAVIGATION_EVENT, CLEAR_NAVIGATION_EVENT } from './eventTypes';

export const initialData = {
  isTopNavigation: true,
  isBottomNavigation: true,
  currentPage: null,
  isBack: true,
  handleClickBack: null,
  isNotifications: true,
  isProfile: true,
  isNext: false,
  handleClickNext: null,
  isMenu: false,
  title: '',
};

export const Context = createContext(initialData);

export const reducer = (state, { type, payload }) => {
  switch (type) {
    case COMMENTS_PAGE: {
      return {
        ...state,
        isTopNavigation: true,
        isBottomNavigation: false,
        currentPage: type,
        isBack: true,
        isNotifications: false,
        isProfile: true,
        isNext: false,
        isMenu: false,
        title: '댓글 보기',
      };
    }
    case EXPLORE_PAGE: {
      return {
        ...state,
        isTopNavigation: true,
        isBottomNavigation: true,
        currentPage: type,
        isBack: true,
        isNotifications: true,
        isProfile: true,
        isNext: false,
        isMenu: false,
        title: '탐색',
      };
    }
    case HOME_PAGE: {
      return {
        ...state,
        isTopNavigation: true,
        isBottomNavigation: true,
        currentPage: type,
        isBack: false,
        isNotifications: true,
        isProfile: true,
        isNext: false,
        isMenu: false,
        title: '',
      };
    }
    case LOGIN_PAGE: {
      return {
        ...state,
        isTopNavigation: false,
        isBottomNavigation: false,
        currentPage: type,
        isBack: true,
        isNotifications: false,
        isProfile: true,
        isNext: false,
        isMenu: false,
        title: '',
      };
    }
    case NOT_FOUND_PAGE: {
      return {
        ...state,
        isTopNavigation: false,
        isBottomNavigation: false,
        currentPage: type,
        isBack: true,
        isNotifications: false,
        isProfile: true,
        isNext: false,
        isMenu: false,
        title: '',
      };
    }
    case NOTIFICATIONS_PAGE: {
      return {
        ...state,
        isTopNavigation: true,
        isBottomNavigation: false,
        currentPage: type,
        isBack: true,
        isNotifications: false,
        isProfile: false,
        isNext: false,
        isMenu: false,
        title: '알림',
      };
    }
    case POST_PAGE: {
      return {
        ...state,
        isTopNavigation: true,
        isBottomNavigation: true,
        currentPage: type,
        isBack: true,
        isNotifications: false,
        isProfile: true,
        isNext: false,
        isMenu: false,
        title: '',
      };
    }
    case SIGNUP_PAGE: {
      return {
        ...state,
        isTopNavigation: false,
        isBottomNavigation: false,
        currentPage: type,
        isBack: true,
        isNotifications: false,
        isProfile: true,
        isNext: false,
        isMenu: false,
        title: '',
      };
    }
    case UPLOAD_PAGE: {
      return {
        ...state,
        isTopNavigation: true,
        isBottomNavigation: false,
        currentPage: type,
        isBack: true,
        isNotifications: false,
        isProfile: false,
        isNext: true,
        isMenu: false,
        title: '업로드',
      };
    }
    case USER_EDIT_PAGE: {
      return {
        ...state,
        isTopNavigation: true,
        isBottomNavigation: true,
        currentPage: type,
        isBack: true,
        isNotifications: false,
        isProfile: true,
        isNext: false,
        isMenu: false,
        title: '',
      };
    }
    case USER_PAGE: {
      return {
        ...state,
        isTopNavigation: true,
        isBottomNavigation: true,
        currentPage: type,
        isBack: true,
        isNotifications: false,
        isProfile: false,
        isNext: false,
        isMenu: true,
        title: '',
      };
    }
    case USER_MENU_PAGE: {
      return {
        ...state,
        isTopNavigation: true,
        isBottomNavigation: false,
        currentPage: type,
        isBack: true,
        isNotifications: false,
        isProfile: false,
        isNext: false,
        isMenu: false,
        title: '사용자 메뉴',
      };
    }
    case USER_POSTS_PAGE: {
      return {
        ...state,
        isTopNavigation: true,
        isBottomNavigation: false,
        currentPage: type,
        isBack: true,
        isNotifications: false,
        isProfile: true,
        isNext: false,
        isMenu: false,
        title: '',
      };
    }
    case SET_NAVIGATION_EVENT: {
      return {
        ...state,
        handleClickBack: payload.back,
        handleClickNext: payload.next,
      };
    }
    case CLEAR_NAVIGATION_EVENT: {
      return {
        ...state,
        handleClickBack: null,
        handleClickNext: null,
      };
    }

    default: {
      return state;
    }
  }
};
