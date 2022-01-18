import styled from '@emotion/styled';
import { useRef, useState } from 'react';

const UploadContainer = styled.div`
  display: inline-block;
  cursor: pointer;
`;

const Input = styled.input`
  display: none;
`;

const Upload = ({ children, droppable, name, accept, value, onChange = () => {}, ...props }) => {
  const [file, setFile] = useState(value);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const { files } = e.target;
    const changedFile = files[0];
    setFile(changedFile);
    onChange(e);
  };

  const handleChooseFile = () => {
    inputRef.current.click();
  };

  const handleDragEnter = (e) => {
    if (!droppable) return;

    e.preventDefault(); // 브라우저 기본 이벤트를 막는다.
    e.stopPropagation(); // 부모나 자식 컴포넌트로 이벤트가 전파되는 것을 막는다.

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  };
  const handleDragLeave = (e) => {
    if (!droppable) return;

    e.preventDefault();
    e.stopPropagation();

    setDragging(false);
  };
  const handleDragOver = (e) => {
    if (!droppable) return;

    e.preventDefault();
    e.stopPropagation();
  };
  const handleFileDrop = (e) => {
    if (!droppable) return;

    e.preventDefault();
    e.stopPropagation();

    const { files } = e.dataTransfer;
    const changedFile = files[0];
    setFile(changedFile);
    onChange(e);
    setDragging(false);
  };

  return (
    <UploadContainer
      onClick={handleChooseFile}
      onDrop={handleFileDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      {...props}
    >
      <Input ref={inputRef} type="file" name={name} accept={accept} onChange={handleFileChange} />
      {typeof children === 'function' ? children(file, dragging) : children}
    </UploadContainer>
  );
};

export default Upload;
