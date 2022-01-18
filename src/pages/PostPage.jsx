import React, { useEffect } from 'react';
import { useNavigationContext } from '../contexts/NavigationContext';

const PostPage = () => {
  const { onMountPage, pageTypes } = useNavigationContext();

  useEffect(() => onMountPage(pageTypes.POST_PAGE), []);

  return <div>PostPage</div>;
};

export default PostPage;
