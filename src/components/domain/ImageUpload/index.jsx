import styled from '@emotion/styled';
import { useRef, useState } from 'react';
// import { useLocalStorage } from '../../../hooks';

const ImageUpload = ({
  children,
  droppable,
  name,
  accept,
  value,
  onChange = () => {},
  ...props
}) => {
  const [file, setFile] = useState(value);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null); // input 태그에 직접 접근하기 위해 사용

  // 파일이 변경되었을 때 실행
  const handleFileChange = (e) => {
    const { files } = e.target;
    const changedFile = files[0];
    onChange(changedFile);
    setFile(changedFile);
  };

  // UploadContainer 클릭 시, input 클릭 이벤트 실행
  const handleChooseFile = () => {
    inputRef.current.click();
  };

  // 드래그로 컴포넌트 내부로 들어온 경우
  const handleDragEnter = (e) => {
    if (!droppable) return;

    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };

  // 드래그로 컴포넌트 밖으로 나간 경우
  const handleDragLeave = (e) => {
    if (!droppable) return;

    e.preventDefault();
    e.stopPropagation();

    setDragging(false);
  };

  // 이벤트 전파를 막기 위해 만드는 것
  const handleDragOver = (e) => {
    if (!droppable) return;
    e.preventDefault();
    e.stopPropagation();
  };

  // 파일을 컴포넌트에 넣었을 때
  const handleFileDrop = (e) => {
    if (!droppable) return;

    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;
    const changedFile = files[0];
    setFile(changedFile);
    onChange(changedFile);
    setDragging(false);
  };

  return (
    <UploadContainer
      onClick={handleChooseFile}
      onDrop={handleFileDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      value={value}
      {...props}
    >
      <Input ref={inputRef} type="file" name={name} accept={accept} onChange={handleFileChange} />
      {typeof children === 'function' ? children(file, dragging) : children}
    </UploadContainer>
  );
};
const UploadContainer = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: ${({ value }) => `url(${value})`};
`;

const Input = styled.input`
  display: none;
`;

export default ImageUpload;
