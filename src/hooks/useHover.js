import { useCallback, useEffect, useState, useRef } from 'react';

const useHover = () => {
  const [state, setState] = useState(false);
  const ref = useRef(null);

  const handleMouseOver = useCallback(() => setState(true), []);
  const handleMouseOut = useCallback(() => setState(false), []);

  useEffect(() => {
    const element = ref.current;
    if (!element) return; // https://stackoverflow.com/questions/67658900/arrow-function-expected-no-return-value-with-clean-up-function-in-useeffect

    element.addEventListener('mouseover', handleMouseOver);
    element.addEventListener('mouseout', handleMouseOut);

    return () => {
      element.removeEventListener('mouseover', handleMouseOver);
      element.removeEventListener('mouseout', handleMouseOut);
    };
  }, [ref, handleMouseOver, handleMouseOut]);

  return [ref, state];
};

export default useHover;
