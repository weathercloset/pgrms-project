import { Divider, Text } from '../../components/base';

export default {
  title: 'Component/Divider',
  component: Divider,
};

export const Horizontal = () => {
  return (
    <>
      <Text>위</Text>
      <Divider type="horizontal" />
      <Text>아래</Text>
    </>
  );
};

export const Vertical = () => {
  return (
    <>
      <Text>왼쪽</Text>
      <Divider type="vertical" />
      <Text>오른쪽</Text>
    </>
  );
};
