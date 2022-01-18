import React from 'react';
import styled from '@emotion/styled';
import { Slider, Tab } from '../../base';

const ImageEditor = ({ defaultValue, onChange = () => {}, ...props }) => {
  const handleEditValue = (name, newValue) => {
    onChange(name, newValue);
  };
  return (
    <EditorContainer {...props}>
      <Tab reverse style={{ backgroundColor: 'transparent' }}>
        <Tab.Item
          title="위치"
          index="item1"
          style={{ width: '20%', height: 32, borderBottom: 'none', backgroundColor: '#fafafa' }}
        >
          <EditorSlider
            min={0}
            max={100}
            defaultValue={defaultValue.position}
            onChange={handleEditValue}
            name="position"
          />
        </Tab.Item>
        <Tab.Item
          title="밝기"
          index="item2"
          style={{ width: '20%', height: 32, borderBottom: 'none', backgroundColor: '#fafafa' }}
        >
          <EditorSlider
            min={0}
            max={200}
            defaultValue={defaultValue.brightness}
            onChange={handleEditValue}
            name="brightness"
          />
        </Tab.Item>
        <Tab.Item
          title="대비"
          index="item3"
          style={{ width: '20%', height: 32, borderBottom: 'none', backgroundColor: '#fafafa' }}
        >
          <EditorSlider
            min={0}
            max={200}
            defaultValue={defaultValue.contrast}
            onChange={handleEditValue}
            name="contrast"
          />
        </Tab.Item>
        <Tab.Item
          title="채도"
          index="item4"
          style={{ width: '20%', height: 32, borderBottom: 'none', backgroundColor: '#fafafa' }}
        >
          <EditorSlider
            min={0}
            max={200}
            defaultValue={defaultValue.saturate}
            onChange={handleEditValue}
            name="saturate"
          />
        </Tab.Item>
        <Tab.Item
          title="흑백"
          index="item5"
          style={{ width: '20%', height: 32, borderBottom: 'none', backgroundColor: '#fafafa' }}
        >
          <EditorSlider
            min={0}
            max={100}
            defaultValue={defaultValue.grayscale}
            onChange={handleEditValue}
            name="grayscale"
          />
        </Tab.Item>
      </Tab>
    </EditorContainer>
  );
};

const EditorContainer = styled.div`
  position: sticky;
  bottom: 0;
  width: 90%;
  margin: 0 auto;
  padding: 24px 0;
  background: #fafafa;
`;
const EditorSlider = styled(Slider)``;
export default ImageEditor;
