import styled from '@emotion/styled';
import { useRef } from 'react';
import { useToggle } from '../../../hooks';

const Toggle = ({ children, name, on = false, disabled, onChange = () => {}, ...props }) => {
  const [checked, toggle] = useToggle(on);
  const toggleRef = useRef(null);

  const handleChange = () => {
    toggle();
    onChange(name, toggleRef.current.checked);
  };

  return (
    <ToggleContainer {...props}>
      <ToggleInput
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        ref={toggleRef}
      />
      <ToggleText>{children}</ToggleText>
    </ToggleContainer>
  );
};

const ToggleContainer = styled.label`
  display: inline-block;
  cursor: pointer;
  user-select: none;
`;
const ToggleText = styled.span`
  display: inline-block;
  font-size: 16px;
  border: 1px solid black;
  padding: 8px 16px;
  margin-top: 12px;
  margin-right: 12px;
`;

const ToggleInput = styled.input`
  display: none;
  &:checked + span {
    background: black;
    color: white;
  }
  &:disabled + div {
    opacity: 0.7;
    cursor: not-allowed;

    &:after {
      opacity: 0.7;
    }
  }
`;
export default Toggle;
