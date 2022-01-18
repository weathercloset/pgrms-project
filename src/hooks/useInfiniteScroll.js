import { useEffect, useState } from 'react';

const options = {
  root: null,
  rootMargin: '1px',
  threshold: '0.1',
};

const useInfiniteScroll = (targetElement) => {
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let observer;

    if (targetElement) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIsFetching(true);
        }
        setIsFetching(false);
      }, options);
      observer.observe(targetElement);
    }

    return () => observer?.disconnect(targetElement);
  }, [targetElement]);

  return [isFetching];
};

export default useInfiniteScroll;
