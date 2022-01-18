import styled from '@emotion/styled';
import { useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { useClickAway } from '../../../hooks';

const Modal = ({
  children,
  width = 500,
  maxWidth,
  height,
  display = 'flex',
  flexDirection = 'column',
  alignItems = 'center',
  justifyContent = 'center',
  visible = false,
  dimBackgroundImageUrl = '',
  backgroundColor,
  dimColor,
  filter,
  onClose = () => {},
  ...props
}) => {
  const ref = useClickAway(() => {
    onClose();
  });

  const containerStyle = useMemo(
    () => ({
      width,
      maxWidth,
      height,
      display,
      flexDirection,
      alignItems,
      justifyContent,
      backgroundColor,
    }),
    [width, maxWidth, height, display, flexDirection, alignItems, justifyContent, backgroundColor],
  );

  const el = useMemo(() => document.createElement('div'), []);
  useEffect(() => {
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  });

  return ReactDOM.createPortal(
    <Dim style={{ display: visible ? 'block' : 'none' }}>
      <DimBackground
        dimBackgroundImageUrl={dimBackgroundImageUrl}
        dimColor={dimColor}
        filter={filter}
      />
      <ModalContainer ref={ref} {...props} style={{ ...props.style, ...containerStyle }}>
        {children}
      </ModalContainer>
    </Dim>,
    el,
  );
};

const Dim = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2500;
`;

const DimBackground = styled.div`
  width: 100%;
  height: 100%;
  filter: ${({ filter }) =>
    filter
      ? `blur(15px) brightness(80%) contrast(${filter.contrast}%) saturate(${filter.saturate}%) grayscale(${filter.grayscale}%)`
      : ``};
  backdrop-filter: contrast(50%);
  transform: scale(1.2);
  background-size: cover;
  background-color: ${({ dimColor }) => dimColor};
  background-image: ${({ dimBackgroundImageUrl }) => `url(${dimBackgroundImageUrl})`};
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 8px;
  background-color: ${({ backgroundColor }) => backgroundColor || 'transparent'};
  box-shadow: ${({ backgroundColor }) =>
    backgroundColor ? '0 3px 6px rgba(0, 0, 0, 0.2)' : 'transparent'};
  box-sizing: border-box;
`;

export default Modal;
