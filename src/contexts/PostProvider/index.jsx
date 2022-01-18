import { useCallback, useEffect, useReducer, useContext, useState } from 'react';
import { reducer, PostContext } from './reducer';
import { addPost } from '../../utils/apis/snsApi';
import { useLocalToken } from '../../routes/utilRoutes/hooks';

export const usePostContext = () => useContext(PostContext);

const PostProvider = ({ children, initialPosts, handleDeletePost }) => {
  const [posts, dispatch] = useReducer(reducer, initialPosts || []);
  const [userPosts, setUserPosts] = useState([]);

  const [localToken] = useLocalToken();

  const handleAddPost = useCallback(
    async (post) => {
      const { data } = await addPost(localToken, post);
      return data;
    },
    [localToken],
  );

  useEffect(() => {
    dispatch({ type: 'INIT_POSTS', payload: initialPosts || [] });
  }, [initialPosts]);

  const onAddPost = useCallback(
    async (post) => {
      const payload = await handleAddPost(post);
      dispatch({ type: 'ADD_POST', payload });
    },
    [handleAddPost],
  );

  const onDeletePost = useCallback(
    async (id) => {
      const payload = await handleDeletePost(id);
      dispatch({ type: 'DELETE_POST', payload });
    },
    [handleDeletePost],
  );

  const onAddUserPosts = (userPostsData) => {
    setUserPosts([...userPostsData]);
  };
  return (
    <PostContext.Provider value={{ posts, onDeletePost, onAddPost, onAddUserPosts, userPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export default PostProvider;
