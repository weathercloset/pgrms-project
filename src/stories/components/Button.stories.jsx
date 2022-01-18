import { Button } from '../../components/base';

export default {
  title: 'Component/Button',
  component: Button,
  argTypes: {
    fontSize: {
      defaultValue: 16,
      control: { type: 'range', min: 1, max: 100 },
    },
    display: {
      defaultValue: 'flex',
      options: ['flex', 'block', 'inline'],
      control: { type: 'inline-radio' },
    },
    justifyContent: {
      defaultValue: 'center',
      options: ['center', 'flex-start', 'flex-end'],
      control: { type: 'inline-radio' },
    },
    alignItems: {
      defaultValue: 'center',
      options: ['center', 'flex-start', 'flex-end'],
      control: { type: 'inline-radio' },
    },
    width: {
      type: { name: 'string' },
      defaultValue: '100px',
      control: { type: 'text' },
    },
    height: {
      type: { name: 'string' },
      defaultValue: '56px',
      control: { type: 'text' },
    },
    backgroundColor: { control: 'color' },
    color: { control: 'color' },
    border: {
      type: { name: 'string' },
      defaultValue: '1px solid black',
      control: { type: 'text' },
    },
  },
};

export const Default = (args) => {
  return <Button {...args}>버튼입니다</Button>;
};
