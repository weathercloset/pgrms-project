import styled from '@emotion/styled';
import './Button.css';

const Button = ({
  children,
  size,
  type = 'button',
  fontSize = '16px',
  display = 'inline-flex',
  justifyContent = 'center',
  alignItems = 'center',
  width = 'auto',
  height = 'auto',
  backgroundColor = 'white',
  color = 'black',
  border = 'none',
  cursor = 'pointer',
  onClick = () => {},
  ...props
}) => {
  const sizes = {
    big: 'big',
    normal: 'normal',
    small: 'small',
  };

  return (
    <CommonButton
      className={typeof size === 'string' ? `Button--size-${sizes[size] || 'normal'}` : undefined}
      type={type}
      fontSize={fontSize}
      display={display}
      justifyContent={justifyContent}
      alignItems={alignItems}
      width={width}
      height={height}
      backgroundColor={backgroundColor}
      color={color}
      border={border}
      cursor={cursor}
      onClick={onClick}
      {...props}
    >
      {children}
    </CommonButton>
  );
};

const CommonButton = styled.button`
  display: ${({ display }) => display};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  font-size: ${({ fontSize }) =>
    fontSize && typeof fontSize === 'number' ? `${fontSize}px` : fontSize};
  border: ${({ border }) => border};
  cursor: ${({ cursor }) => cursor};
`;

export default Button;
