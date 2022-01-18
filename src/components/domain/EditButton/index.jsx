import styled from '@emotion/styled';
import { useHistory } from 'react-router';

const EditButton = ({ userName }) => {
  const history = useHistory();
  const goEditPage = () => {
    history.push(`/user/${userName}/edit`);
  };
  return (
    <ButtonContainer type="button" onClick={goEditPage}>
      Edit Profile
    </ButtonContainer>
  );
};
const ButtonContainer = styled.button`
  width: 350px;
  height: 40px;
  cursor: pointer;
  background-color: #fffdfa;
  border: 2px solid #ddd;
  &:hover {
    background-color: lightgrey;
  }
`;

export default EditButton;
