import styled from '@emotion/styled';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

const Slider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultValue,
  name,
  onChange = () => {},
  ...props
}) => {
  const sliderRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [value, setValue] = useState(defaultValue || min);

  const handleResizeWindow = useCallback(() => setIsResizing(true), []);

  const handleMouseDown = useCallback(() => {
    setDragging(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  const sliderLeft = useMemo(() => {
    setIsResizing(false);
    return sliderRef?.current?.getBoundingClientRect().x;
  }, [sliderRef?.current, isResizing]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!dragging) return;

      let handleOffset = e.pageX - sliderLeft;
      if (e instanceof TouchEvent) {
        handleOffset = e.changedTouches[0].pageX - sliderLeft;
      }
      const sliderWidth = sliderRef.current.offsetWidth;

      const track = handleOffset / sliderWidth;
      let newValue;
      if (track < 0) {
        newValue = min;
      } else if (track > 1) {
        newValue = max;
      } else {
        newValue = Math.round((min + (max - min) * track) / step) * step;
        newValue = Math.min(max, Math.max(min, newValue));
      }

      setValue(newValue);
      onChange(name, newValue);
    };

    window.addEventListener('resize', handleResizeWindow);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchend', handleMouseUp);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [value, min, max, dragging, sliderRef, handleMouseUp, onChange, step, name]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <SliderContainer ref={sliderRef} {...props}>
      <Rail />
      <Track style={{ width: `${percentage}%` }} />
      <Handle
        value={value}
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{ left: `${percentage}%` }}
      />
    </SliderContainer>
  );
};
const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 24px;
`;

const Rail = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.grey200};
`;

const Handle = styled.div`
  position: absolute;
  top: 12px;
  left: 0;
  width: 16px;
  height: 16px;
  transform: translate(-50%, -50%);
  border: 2px solid ${({ theme }) => theme.colors.grey900};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.white};
  cursor: grab;
`;

const Track = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  width: 0;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.grey900};
`;

export default Slider;
