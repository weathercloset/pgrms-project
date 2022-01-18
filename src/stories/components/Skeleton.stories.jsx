import { Skeleton } from '../../components/base';

export default {
  title: 'Component/Skeleton',
};

export const Box = (args) => <Skeleton.Box {...args} />;
Box.argTypes = {
  width: { defaultValue: 200, control: 'number' },
  height: { defaultValue: 100, control: 'number' },
};

export const Circle = (args) => <Skeleton.Circle {...args} />;
Circle.argTypes = {
  size: { defaultValue: 100, control: 'number' },
};

export const Paragraph = (args) => <Skeleton.Paragraph {...args} />;
Paragraph.argTypes = {
  line: { defaultValue: 3, control: 'number' },
};

export const Sample = () => {
  return (
    <>
      <div>
        <div style={{ float: 'left', marginRight: 16 }}>
          <Skeleton.Circle size={60} />
        </div>
        <div style={{ float: 'left', width: '80%' }}>
          <Skeleton.Paragraph line={4} />
        </div>
        <div style={{ clear: 'both' }} />
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ float: 'left', marginRight: 16 }}>
          <Skeleton.Circle size={60} />
        </div>
        <div style={{ float: 'left', width: '80%' }}>
          <Skeleton.Paragraph line={4} />
        </div>
        <div style={{ clear: 'both' }} />
      </div>

      <div style={{ marginTop: 16 }}>
        <div style={{ float: 'left', marginRight: 16 }}>
          <Skeleton.Circle size={60} />
        </div>
        <div style={{ float: 'left', width: '80%' }}>
          <Skeleton.Paragraph line={4} />
        </div>
        <div style={{ clear: 'both' }} />
      </div>
    </>
  );
};
