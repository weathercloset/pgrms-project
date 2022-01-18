import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import { useHistory } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useWeatherContext } from '../contexts/WeatherProvider';
import { usePostContext } from '../contexts/PostProvider';
import { useNavigationContext } from '../contexts/NavigationContext';
import { useLocalStorage, useDebounce } from '../hooks';
import { ImageUpload, ImageEditor, PostTag, EvaluationModal } from '../components/domain';
import { getMetaData } from '../utils/functions/commonUtil';
import { getUserPosts } from '../utils/apis/snsApi';
import { Header, Button, Spinner, Modal, Text } from '../components/base';

const UploadPage = () => {
  const history = useHistory();
  const { onMountPage, pageTypes, setNavigationEvent, clearNavigationEvent } =
    useNavigationContext();

  // 유저
  const { currentUser } = useAuth();

  // 평가모달
  const initNotFinishedEvaluation = useMemo(
    () => ({
      _id: '',
      title: '',
      meta: '',
      image: 'https://via.placeholder.com/200',
    }),
    [],
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [notFinishedEvaluation, setNotFinishedEvaluation] = useState(initNotFinishedEvaluation);

  // 날씨 관련
  const {
    weatherInformation: { weather, error, isLoading, isError },
  } = useWeatherContext();
  const { nowTemp = 0, minTemp = 0, maxTemp = 0, weatherName } = weather;

  // 포스트
  const { onAddPost } = usePostContext();

  const [uploadStep, setUploadStep] = useState(1);
  // const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  // 포스트 로컬스토리지
  const [savedPost, setSavedPost] = useLocalStorage('savedPost', '');
  const [savedImgUrl, setSavedImgUrl] = useLocalStorage('savedImgUrl', '');
  const [savedImgFilter, setSavedImgFilter] = useLocalStorage('savedImgFilter', '');

  const [localstorageModalVisible, setLocalstorageModalVisible] = useState(false);

  // 전송할 데이터
  const [defaultPost, setDefaultPost] = useState(
    savedPost || {
      title: nowTemp,
      meta: {
        isEvaluation: false,
        evaluation: '',
        tags: [],
        weather: weatherName,
        maxTemperature: maxTemp,
        minTemperature: minTemp,
        diffTemperature: maxTemp - minTemp,
      },
    },
  );
  const [imageFileData, setImageFileData] = useState(null);
  const [imageFilter, setImageFilter] = useState(
    savedImgFilter || {
      position: 50,
      brightness: 100,
      contrast: 100,
      grayscale: 0,
      saturate: 100,
    },
  );

  const [imageURL, setImageURL] = useState('');

  // 데이터URL -> 파일
  const dataURLtoFile = useCallback(async (url, filename) => {
    const type = filename.split('.').pop();
    const convertedFile = await fetch(url)
      .then((res) => res.arrayBuffer())
      .then((buf) => new File([buf], filename, { type: `image/${type}` }));

    return convertedFile;
  }, []);

  // 파일 -> 데이터URL로 변환 후 로컬스토리지 저장
  const saveFiletoDataURL = useCallback((imageFile) => {
    if (imageFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSavedImgUrl((prev) => ({ ...prev, url: e.target.result, fileName: imageFile.name }));
      };
      reader.readAsDataURL(imageFile);
    }
  }, []);

  // 파일 -> URL로 변환
  // (로컬스토리지 데이터 받아서 편집시 계속 네트워크 호출하는 문제 때문에 추가)
  const FiletoDataURL = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.onload = (e) => {
        setImageURL(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageURL('');
    }
  };

  // submit, change 관련 이벤트
  const validate = ({ image }) => {
    const errors = {};
    if (!image) errors.image = '이미지를 추가해주세요.';
    return errors;
  };

  const handleImageFile = async (file) => {
    if (file) {
      setImageFileData(file);
      setImageFilter({
        position: 50,
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        saturate: 100,
      });
      await saveFiletoDataURL(file);
      await FiletoDataURL(file);
      setUploadStep(2);
    }
  };
  const handleImageEditor = (name, newValue) => {
    setImageFilter((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleTags = (name, checked) => {
    if (checked) {
      setDefaultPost((prev) => ({
        ...prev,
        meta: { ...prev.meta, tags: [...prev.meta.tags, name] },
      }));
    } else {
      const newTags = defaultPost.meta.tags.filter((item) => {
        return item !== name;
      });
      setDefaultPost((prev) => ({
        ...prev,
        meta: { ...prev.meta, tags: newTags },
      }));
    }
  };

  const handleSubmit = async (e) => {
    if (isUploading) {
      return;
    }
    setIsUploading(true);
    e.preventDefault();
    const values = {
      ...defaultPost,
      image: imageFileData,
      meta: { ...defaultPost.meta, ...imageFilter },
    };
    const newErrors = validate ? validate(values) : {};
    if (Object.keys(newErrors).length === 0) {
      await onAddPost(values);
    }
    // setErrors(newErrors);
    setSavedPost('');
    setSavedImgUrl('');
    setSavedImgFilter('');
    setIsUploading(false);
    history.push('/');
  };

  // 평가할 포스트가 있는지 체크
  const handleEvaluation = useCallback(async () => {
    if (currentUser.uid) {
      const { data, error: postError } = await getUserPosts(currentUser.uid);
      const notFinishedEvaluationData = data.filter(({ meta, author }) => {
        const nowMeta = getMetaData(meta);
        return nowMeta.isEvaluation === false && author._id === currentUser.uid;
      })[0];

      if (notFinishedEvaluationData) {
        setNotFinishedEvaluation(notFinishedEvaluationData);
        setModalVisible(true);
      }
    }
  }, [currentUser.uid]);

  useEffect(() => {
    handleEvaluation();
  }, [handleEvaluation]);

  // 로컬 스토리지 데이터 삭제하기
  const localstorageDataClear = () => {
    setSavedPost('');
    setSavedImgUrl('');
    setSavedImgFilter('');
    setUploadStep(1);
    setLocalstorageModalVisible(false);
  };

  // 로컬 스토리지 데이터 가져오기
  const asyncDataUrlToFile = async () => {
    if (savedImgUrl.url) {
      const convertFile = await dataURLtoFile(savedImgUrl.url, savedImgUrl.fileName);
      await setImageFileData(convertFile);
      await FiletoDataURL(convertFile);
      await setUploadStep(2);
    }
    setLocalstorageModalVisible(false);
  };
  // 최초 렌더링 됬을 때
  useEffect(() => {
    if (savedImgUrl.url) {
      setLocalstorageModalVisible(true);
    }
  }, []);

  useEffect(() => {
    setDefaultPost({
      ...defaultPost,
      title: nowTemp,
      meta: {
        ...defaultPost.meta,
        weather: weatherName,
        maxTemperature: maxTemp,
        minTemperature: minTemp,
        diffTemperature: maxTemp - minTemp,
      },
    });
  }, [weather]);

  useEffect(() => {
    onMountPage(pageTypes.UPLOAD_PAGE);

    if (uploadStep > 2) {
      setNavigationEvent({
        back: () => setUploadStep((prev) => prev - 1),
      });
    } else if (uploadStep <= 2 && savedImgUrl.url) {
      setNavigationEvent({
        next: () => setUploadStep(3),
        back: history.goBack,
      });
    }

    return clearNavigationEvent;
  }, [uploadStep, savedImgUrl.url]);

  // value가 바뀔 때, 로컬스토리지 업데이트
  useDebounce(
    () => {
      setSavedPost(defaultPost);
      setSavedImgFilter(imageFilter);
    },
    200,
    [defaultPost, imageFilter, setSavedPost, setSavedImgFilter],
  );
  const uploadContainerRef = useRef(null);

  return (
    <UploadContainer ref={uploadContainerRef}>
      {isUploading ? (
        <div
          style={{
            display: 'block',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Spinner size={50} />
        </div>
      ) : (
        ''
      )}
      {isLoading ? <Spinner /> : ''}
      {uploadStep === 2 ? (
        ''
      ) : (
        <div>
          <Header style={{ fontSize: 42, fontWeight: 500, marginTop: 16 }}>
            {nowTemp}℃ Closet
            <div>{isError ? JSON.stringify(error) : null}</div>
          </Header>
          <Text block style={{ fontSize: 22, marginTop: 8 }}>
            현재기온 {nowTemp}({maxTemp - minTemp})
          </Text>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <ImageContainer
          uploadStep={uploadStep}
          savedImgUrl={savedImgUrl}
          width={uploadContainerRef?.current?.clientWidth * (uploadStep === 3 ? 0.3 : 0.8) || 1}
        >
          <ImageUpload
            droppable
            name="image"
            accept="image/*"
            value={imageURL}
            onChange={handleImageFile}
            style={{
              filter: `brightness(${imageFilter.brightness}%) contrast(${imageFilter.contrast}%) saturate(${imageFilter.saturate}%) grayscale(${imageFilter.grayscale}%)`,
              backgroundPosition: `${imageFilter.position}%`,
            }}
          >
            {(file, dragging) => (
              <ImageUploadIcon dragging={dragging} uploadStep={uploadStep}>
                <span>+</span>
              </ImageUploadIcon>
            )}
          </ImageUpload>
        </ImageContainer>
        {savedImgUrl.url && uploadStep === 2 ? (
          <ImageEditor defaultValue={imageFilter} onChange={handleImageEditor} />
        ) : (
          ''
        )}
        {savedImgUrl.url && uploadStep === 3 ? (
          <>
            <PostTag onChange={handleTags} />
            <UploadButton
              type="submit"
              height="56px"
              backgroundColor="black"
              color="white"
              disabled={isUploading}
            >
              등록하기
            </UploadButton>
          </>
        ) : (
          ''
        )}
      </form>
      <EvaluationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        notFinishedEvaluation={notFinishedEvaluation} // 평가하지 않은 포스트 던져주기
      />
      <Modal
        maxWidth="90vw"
        backgroundColor="white"
        dimColor="rgba(0, 0, 0, 0.6)"
        visible={localstorageModalVisible}
      >
        <ModalQuestion>작성중인 포스트를 불러올까요?</ModalQuestion>
        <ModalBottomButtonContainer>
          <ModalButton border type="button" onClick={localstorageDataClear}>
            아니요
          </ModalButton>
          <ModalButton type="button" onClick={asyncDataUrlToFile}>
            네 좋아요!
          </ModalButton>
        </ModalBottomButtonContainer>
      </Modal>
    </UploadContainer>
  );
};
const UploadContainer = styled.div`
  padding: 0 16px;
`;
const ImageContainer = styled.div`
  position: relative;
  width: ${({ width }) => width}px;
  height: ${({ width }) => width * 1.66}px;
  margin: ${({ uploadStep }) => (uploadStep === 3 ? '' : '0 auto')};
`;
const ImageUploadIcon = styled.div`
  display: ${({ uploadStep }) => (uploadStep === 1 ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 100px;
  border: 1px solid
    ${({ dragging, theme }) => (dragging ? theme.colors.grey900 : theme.colors.grey300)};
  color: ${({ dragging, theme }) => (dragging ? theme.colors.grey900 : theme.colors.grey300)};
`;
const UploadButton = styled(Button)`
  position: fixed;
  bottom: 24px;
  width: calc(100% - 32px);
  max-width: 608px;
`;
const ModalQuestion = styled.div`
  font-size: 16px;
  padding: 40px 0;
`;

const ModalBottomButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;
const ModalButton = styled.button`
  font-size: 16px;
  font-weight: 700;
  flex: 1;
  display: block;
  outline: none;
  padding: 16px 28px;
  border: 1px solid ${({ theme, border }) => (border ? theme.colors.grey200 : theme.colors.grey800)};
  color: ${({ theme, border }) => (border ? theme.colors.grey600 : theme.colors.white)};
  background: ${({ theme, border }) => (border ? theme.colors.white : theme.colors.grey800)};
`;
export default UploadPage;
