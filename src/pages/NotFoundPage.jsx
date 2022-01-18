import React, { useEffect } from 'react';
import { useNavigationContext } from '../contexts/NavigationContext';

const NotFoundPage = () => {
  const { onMountPage, pageTypes } = useNavigationContext();

  useEffect(() => onMountPage(pageTypes.NOT_FOUND_PAGE), []);

  return <div>NotFoundPage</div>;
};

export default NotFoundPage;
