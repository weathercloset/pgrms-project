import axios from 'axios';
import { API_METHOD } from '../constants/apiConstant';
import { onFulfilled, onRejected } from './common';

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = process.env.REACT_APP_SNS_API_END_POINT;

axiosInstance.interceptors.response.use(onFulfilled, onRejected);

const request = async (config) => {
  return axiosInstance(config);
};

export const login = ({ email, password }) => {
  return request({
    method: API_METHOD.POST,
    url: `/login`,
    data: {
      email,
      password,
    },
  });
};

export const signup = ({ email, password, fullName, username }) => {
  return request({
    method: API_METHOD.POST,
    url: `/signup`,
    data: {
      email,
      password,
      fullName,
      username,
    },
  });
};

export const getCurrentUser = (token) => {
  return request({
    method: API_METHOD.GET,
    url: `/auth-user`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const getNotifications = (token) => {
  return request({
    method: API_METHOD.GET,
    url: `/notifications`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const createNotification = (token, data) => {
  return request({
    method: API_METHOD.POST,
    url: `/notifications/create`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data,
  });
};

export const setNotificationSeen = (token) => {
  return request({
    method: API_METHOD.PUT,
    url: `/notifications/seen`,
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

export const getPosts = () => {
  return request({
    method: API_METHOD.GET,
    url: `/posts/channel/${process.env.REACT_APP_CHANNEL_ID_DALI}`,
  });
};

export const getPostsParts = ({ offset, limit }) => {
  return request({
    method: API_METHOD.GET,
    url: `/posts/channel/${process.env.REACT_APP_CHANNEL_ID_DALI}`,
    params: {
      offset,
      limit,
    },
  });
};

export const changeUserName = (token, fullName, username) => {
  return request({
    method: API_METHOD.PUT,
    url: `/settings/update-user`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      ...(fullName && { fullName }),
      ...(username && { username }),
    },
  });
};

export const changePassword = (token, password) => {
  return request({
    method: API_METHOD.PUT,
    url: `/settings/update-password`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      password,
    },
  });
};

export const changeProfile = (token, data) => {
  const formData = new FormData();
  formData.append('isCover', false);
  Object.keys(data).forEach((key) => formData.append(key, data[key]));
  return request({
    method: API_METHOD.POST,
    url: `/users/upload-photo`,
    headers: {
      'Content-Type': `multipart/form-data`,
      authorization: `Bearer ${token}`,
    },
    data: formData,
  });
};

export const addPost = (token, data) => {
  const submitData = { ...data, meta: JSON.stringify(data.meta) };
  const formData = new FormData();
  Object.keys(submitData).forEach((key) => formData.append(key, submitData[key]));
  formData.append('channelId', process.env.REACT_APP_CHANNEL_ID_DALI);

  return request({
    method: API_METHOD.POST,
    url: `/posts/create`,
    headers: {
      'Content-Type': `multipart/form-data`,
      authorization: `Bearer ${token}`,
    },
    data: formData,
  });
};

export const getUsersData = (userName) => {
  return request({
    method: API_METHOD.GET,
    url: `/search/users/${userName}`,
  });
};

export const setFollow = (token, id) => {
  return request({
    method: API_METHOD.POST,
    url: `/follow/create`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      userId: id,
    },
  });
};

export const setUnFollow = (token, id) => {
  return request({
    method: API_METHOD.DELETE,
    url: `/follow/delete`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      id,
    },
  });
};

export const getUserPosts = (userId) => {
  return request({
    method: API_METHOD.GET,
    url: `/posts/author/${userId}`,
  });
};

export const getPostData = (postId) => {
  return request({
    method: API_METHOD.GET,
    url: `/posts/${postId}`,
  });
};

export const updatePostData = (token, data) => {
  return request({
    method: API_METHOD.PUT,
    url: `/posts/update`,
    headers: {
      'Content-Type': `multipart/form-data`,
      authorization: `Bearer ${token}`,
    },
    data,
  });
};

export const setLike = (token, postId) => {
  return request({
    method: API_METHOD.POST,
    url: `/likes/create`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      postId,
    },
  });
};

export const setDislike = (token, postId) => {
  return request({
    method: API_METHOD.DELETE,
    url: `/likes/delete`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      id: postId,
    },
  });
};

export const setComment = (token, postId, comment) => {
  return request({
    method: API_METHOD.POST,
    url: `/comments/create`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      comment,
      postId,
    },
  });
};

export const deleteComment = (token, id) => {
  return request({
    method: API_METHOD.DELETE,
    url: `/comments/delete`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      id,
    },
  });
};

export const deletePost = (token, postId) => {
  return request({
    method: API_METHOD.DELETE,
    url: `/posts/delete`,
    headers: {
      authorization: `Bearer ${token}`,
    },
    data: {
      id: postId,
    },
  });
};
