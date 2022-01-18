import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { Button, Modal, Text, Toast } from '../../base';
import { getMetaData } from '../../../utils/functions/commonUtil';
import { updatePostData } from '../../../utils/apis/snsApi';
import { useLocalToken } from '../../../routes/utilRoutes/hooks';

const EvaluationModal = React.memo(
  ({
    modalVisible,
    setModalVisible,
    notFinishedEvaluation = {
      _id: '',
      title: '',
      meta: '',
      image: 'https://via.placeholder.com/200',
    },
    afterEvaluationCallback,
    onClose = () => {},
  }) => {
    const [token] = useLocalToken();
    const evaluationButtonDatas = [
      {
        key: 'evaluationColdButton',
        name: 'cold',
        text: '추웠어요 🥶',
        backgroundColor: 'rgba(0, 0, 255, 0.5 )',
      },
      {
        key: 'evaluationGoodButton',
        name: 'good',
        text: '좋았어요 🤩',
        backgroundColor: 'rgba(255, 255, 0, 0.5 )',
      },
      {
        key: 'evaluationHotButton',
        name: 'hot',
        text: '더웠어요 🥵',
        backgroundColor: 'rgba(255, 0, 0, 0.5 )',
      },
    ];

    const handleEvaluation = useCallback(
      async (e) => {
        if (!notFinishedEvaluation._id) {
          return;
        }

        const evaluationData = e.currentTarget.name;
        const oldMeta = getMetaData(notFinishedEvaluation.meta);
        const newMeta = { ...oldMeta, isEvaluation: true, evaluation: evaluationData };
        const data = {
          postId: notFinishedEvaluation._id,
          meta: JSON.stringify(newMeta),
          title: notFinishedEvaluation.title,
        };
        const formData = new FormData();

        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        formData.append('channelId', process.env.REACT_APP_CHANNEL_ID_DALI);

        const { error: updatePostError } = await updatePostData(token, formData);

        if (updatePostError.code) {
          Toast.show(updatePostError.message, 3000);
        }

        if (afterEvaluationCallback && typeof afterEvaluationCallback === 'function') {
          await afterEvaluationCallback();
        }

        setModalVisible(false);
      },
      [notFinishedEvaluation, token, afterEvaluationCallback, setModalVisible],
    );

    return (
      <Modal
        width="auto"
        maxWidth="640px"
        visible={modalVisible}
        onClose={onClose}
        backgroundColor="none"
        dimBackgroundImageUrl={notFinishedEvaluation.image}
        filter={getMetaData(notFinishedEvaluation.meta)}
      >
        <Text size={22} color="white">
          오늘 코디는 어떠셨나요?
        </Text>
        <ModalImageWrapper
          backgroundImageUrl={notFinishedEvaluation.image}
          filter={getMetaData(notFinishedEvaluation.meta)}
        />

        <EvaluationButtonWrapper>
          {evaluationButtonDatas.map(({ key, name, text, backgroundColor }) => (
            <Button
              width="auto"
              key={key}
              backgroundColor={backgroundColor}
              name={name}
              color="white"
              onClick={handleEvaluation}
              style={{ padding: '8px', whiteSpace: 'nowrap', flex: 1 }}
            >
              <Text size={16} color="white">
                {text}
              </Text>
            </Button>
          ))}
        </EvaluationButtonWrapper>
      </Modal>
    );
  },
);

const EvaluationButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 0 16px;
`;

const ModalImageWrapper = styled.div`
  width: 30vmax;
  height: 50vmax;
  max-width: 450px;
  max-height: 750px;
  margin: 16px 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: ${({ backgroundImageUrl }) => `url(${backgroundImageUrl})`};

  filter: ${({ filter }) =>
    filter
      ? `brightness(${filter.brightness}%) contrast(${filter.contrast}%) saturate(${filter.saturate}%) grayscale(${filter.grayscale}%)`
      : ``};
  background-position: ${({ filter }) => (filter ? `${filter.position}%` : ``)};
`;

export default EvaluationModal;
