import { Breadcrumb } from '../../components/base';

export default {
  title: 'Component/Breadcrumb',
  component: Breadcrumb,
};

export const Default = () => {
  return (
    <Breadcrumb>
      <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
      <Breadcrumb.Item href="/level1">Level 1</Breadcrumb.Item>
      <Breadcrumb.Item>Level 2</Breadcrumb.Item>
    </Breadcrumb>
  );
};
