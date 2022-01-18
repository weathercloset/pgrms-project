import styled from '@emotion/styled';
import Base from './Base';

const CircularBase = styled(Base)`
  border-radius: 50%;
`;

const Circle = ({ size }) => <CircularBase style={{ width: size, height: size }} />;

export default Circle;
