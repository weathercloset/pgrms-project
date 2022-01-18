import { useState } from 'react';
import useHotKey from '../../hooks/useHotKey';

export default {
  title: 'Hook/useHotKey',
};

export const Default = () => {
  const [value, setValue] = useState('');
  const hotkeys = [
    {
      global: true,
      combo: 'meta+shift+k',
      onKeyDown: () => {
        alert('meta+shift+k');
      },
    },
    {
      combo: 'esc',
      onKeyDown: () => {
        setValue('');
      },
    },
  ];

  const { handleKeyDown } = useHotKey(hotkeys);

  return (
    <div>
      <div>useHotKey 테스트</div>
      <input onKeyDown={handleKeyDown} value={value} onChange={(e) => setValue(e.target.value)} />
    </div>
  );
};
