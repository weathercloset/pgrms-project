import useTimeoutFn from '../../hooks';

export default {
  title: 'Hook/useTimeoutFn',
};

export const Default = () => {
  const [run, clear] = useTimeoutFn(() => {
    alert('실행!');
  }, 3000);

  return (
    <>
      <div>useTimeoutFn 테스트</div>
      <button type="button" onClick={run}>
        3초 뒤 실행!
      </button>
      <button type="button" onClick={clear}>
        멈춰!
      </button>
    </>
  );
};
