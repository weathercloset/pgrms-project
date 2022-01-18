import styled from '@emotion/styled';

const Input = ({ type, name, value, onChange, placeholder, ...props }) => {
  return (
    <InputContainer
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ ...props.style }}
    />
  );
};

export const InputContainer = styled.input`
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #eee;
  background: white;
  margin-bottom: 6px;
  outline: none;

  transition: opacity 100ms;
  &:hover {
    opacity: 0.8;
  }
  &:focus {
    outline: 1px solid #ddd;
  }
`;

export default Input;
