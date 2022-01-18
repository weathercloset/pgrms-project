import { useCallback, useEffect, useRef } from 'react';

const useIntervalFn = (fn, ms) => {
  const intervalId = useRef();
  const callback = useRef(fn);

  useEffect(() => {
    callback.current = fn;
  }, [fn]);

  const run = useCallback(() => {
    if (intervalId.current) clearInterval(intervalId.current);

    intervalId.current = setInterval(() => {
      callback.current();
    }, ms);
  }, [ms]);

  const clear = useCallback(() => {
    if (intervalId.current) clearInterval(intervalId.current);
  }, []);

  useEffect(() => clear, [clear]);

  return [run, clear];
};

export default useIntervalFn;
