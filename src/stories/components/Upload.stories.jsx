import { useState, useCallback, useEffect } from 'react';
import { Upload } from '../../components/base';
import { useLocalStorage } from '../../hooks';

export default {
  title: 'Component/Upload',
  component: Upload,
};

export const Default = () => {
  return (
    <Upload>
      <button type="button">Click me</button>
    </Upload>
  );
};

export const AccessFile = () => {
  return (
    <Upload>{(file) => <button type="button">{file ? file.name : 'Click me'}</button>}</Upload>
  );
};

export const Droppable = () => {
  return (
    <Upload droppable>
      {(file, dragging) => {
        return <UploadedImage file={file} dragging={dragging} />;
      }}
    </Upload>
  );
};

const initialImageStorage = { url: '', fileName: '' };

const UploadedImage = ({ file: image, dragging }) => {
  // const [imageBinaryString, setImageBinaryString] = useLocalStorage('imageBinaryString', '');
  const [imageStorage, setImageStorage] = useLocalStorage('imageUrl', initialImageStorage);
  const [file, setFile] = useState(null);

  const dataURLtoFile = useCallback(async (url, filename) => {
    const convertedFile = await fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], filename));

    return convertedFile;
  }, []);

  useEffect(() => {
    const asyncDataUrlToFile = async () => {
      if (imageStorage.url) {
        const imageFileDataUrlToFile = await dataURLtoFile(imageStorage.url, imageStorage.fileName);
        setFile(imageFileDataUrlToFile);
      }
    };
    asyncDataUrlToFile();
  }, [imageStorage.url]);

  const previewImage = useCallback(
    (imageFile) => {
      const urlReader = new FileReader();

      if (imageFile) {
        urlReader.onload = (e) => {
          setImageStorage((prev) => ({ ...prev, url: e.target.result, fileName: imageFile.name }));
          const imageFileDataUrlToFile = dataURLtoFile(
            e.target.result,
            `jonghyeon${imageStorage.fileName}`,
          );
          setFile(imageFileDataUrlToFile);
        };
        urlReader.readAsDataURL(imageFile);
      } else {
        setImageStorage(initialImageStorage);
        setFile('');
      }
    },
    [setImageStorage, dataURLtoFile],
  );

  useEffect(() => {
    if (image) previewImage(image);
  }, [image]);

  return (
    <div style={{ fontSize: 8, width: 800, wordBreak: 'break-all' }}>
      <div
        style={{
          width: 300,
          height: 100,
          border: '4px dashed #aaa',
          borderColor: dragging ? 'black' : '#aaa',
          background: `url(${imageStorage.url})`,
        }}
      >
        {image ? image.name : 'Click or drag file to this area to upload.'}
      </div>
      imageUrl:{imageStorage.url}
    </div>
  );
};
