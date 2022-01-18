import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { Toast } from '../../components/base';
import ToastItem from '../../components/base/Toast/ToastItem';

export default {
  title: 'Component/Toast',
};

export const Default = () => {
  return (
    <button type="button" onClick={() => Toast.show('안녕하세요!', 3000)}>
      Show Toast
    </button>
  );
};

export const WithoutProgressBar = () => {
  return <TestToastComponent isProgressBar={false} />;
};

export const WithProgressBar = () => {
  return <TestToastComponent isProgressBar />;
};

const TestToastComponent = ({ isProgressBar = true }) => {
  const testMessages = [
    '안녕하세요',
    'Hello',
    'Здраво',
    'Halo',
    'नमस्ते',
    'שלום',
    'добры дзень',
    '你好',
    'Sawubona',
    'Halo',
    'γεια σας',
    'Hej',
  ];

  const getRandomMessage = (testMessages) =>
    testMessages[Math.floor(Math.random() * testMessages.length) % testMessages.length];

  const [ms, setMs] = useState(3000);

  const handleSetInterval = () =>
    setInterval(() => {
      setMs((prev) => prev + 1000);
    }, 1000);

  useEffect(() => {
    handleSetInterval();
  }, []);

  return (
    <ToastItemTestBackground hue={ms}>
      <div style={{ position: 'absolute', top: 0, fontSize: 100, fontWeight: 900 }}>
        <button
          type="button"
          onClick={() => Toast.show(getRandomMessage(testMessages), 3000, isProgressBar)}
        >
          Show Toast
        </button>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Laboriosam harum pariatur illo
        deserunt est unde, quos labore atque debitis odio dicta distinctio consequatur magnam
        quibusdam expedita laudantium cumque quaerat dolorem! Consectetur, provident autem? Unde
      </div>

      <ToastItem
        message={`테스트를 위해 점점 늘어나~
        ${Math.abs(ms / 1000)}초가 지나면 토스트가 끝날 거에요`}
        duration={ms}
      />
    </ToastItemTestBackground>
  );
};

const ToastItemTestBackground = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(
    ${({ hue }) => Math.abs(hue / 60) % 360}deg,
    hsl(${({ hue }) => Math.abs(hue / 60) % 360}, 100%, 50%) ${({ hue }) => (hue % 100) + 0}%,
    hsl(${({ hue }) => Math.abs(hue / 80 + 40) % 360}, 100%, 50%) ${({ hue }) => (hue % 100) + 30}%,
    hsl(${({ hue }) => Math.abs(hue / 90 + 200) % 360}, 100%, 50%) ${({ hue }) => (hue % 100) + 90}%
  );
`;
