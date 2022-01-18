import { Toggle } from '../../components/base';

export default {
  title: 'Component/Toggle',
  component: Toggle,
  argTypes: {
    disabled: { control: 'boolean' },
  },
};

export const Default = (args) => {
  return <Toggle {...args} />;
};
