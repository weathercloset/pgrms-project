import styled from '@emotion/styled';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { useNavigationContext } from '../contexts/NavigationContext';
import { createNotification, deleteComment, getPostData, setComment } from '../utils/apis/snsApi';
import { Avatar, Toast, Text, Icon, Modal, Image } from '../components/base';
import { useLocalToken } from '../routes/utilRoutes/hooks';
import { useAuth } from '../contexts/AuthContext';
import { getMetaData, getStyleMapByMeta } from '../utils/functions/commonUtil';
import { makeEvaluationEmojiMap } from '../utils/functions/weatherUtil';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const CommentsPage = () => {
  const [postItemWidth, setPostItemWidth] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const [postAuthorId, setPostAuthorId] = useState('');
  const { onMountPage, pageTypes } = useNavigationContext();
  const { currentUser } = useAuth();
  const [post, setPost] = useState({
    title: '',
    image: '',
    author: { username: '' },
    createdAt: '',
    meta: '',
    metaMap: {},
    styleMap: {},
  });
  const [commentsList, setCommentsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentValue, setCommentValue] = useState('');
  const [clickedCommentId, setClickedCommentId] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [token] = useLocalToken();
  const { postId } = useParams();
  const history = useHistory();

  const getPostDataAsync = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await getPostData(postId);

    if (!error.code) {
      const reversedComment = data.comments.reverse();
      setCommentsList(reversedComment);
      setPost({
        ...data,
        metaMap: getMetaData(data.meta),
        styleMap: getStyleMapByMeta(data.meta),
      });
      setPostAuthorId(data.author._id);
    } else {
      Toast.show(error.message, 3000);
      history.push('/');
    }
    setIsLoading(false);
  }, [postId, history]);

  const handleChange = (e) => {
    setCommentValue(() => e.target.value);
  };

  const onCommentButtonClick = async () => {
    if (commentValue) {
      const { data, error } = await setComment(token, postId, commentValue);
      if (!error.code) {
        setCommentsList((prev) => [data, ...prev]);
        await createNotification(token, {
          notificationType: 'COMMENT',
          notificationTypeId: data._id,
          userId: postAuthorId,
          postId,
        });
      } else {
        Toast.show(error.message, 3000);
      }
      setCommentValue('');
    }
  };

  const onDeleteClick = async () => {
    const { error } = await deleteComment(token, clickedCommentId);
    if (!error.code) {
      setCommentsList((prev) => prev.filter(({ _id }) => _id !== clickedCommentId));
    } else {
      Toast.show(error.message, 3000);
    }
    setClickedCommentId('');
    setDeleteModalVisible(false);
  };

  useEffect(() => onMountPage(pageTypes.COMMENTS_PAGE), []);
  useEffect(() => {
    getPostDataAsync();
  }, [getPostDataAsync]);

  const handleResizeWindow = useCallback(() => setIsResizing(true), []);

  useEffect(() => {
    setPostItemWidth(containerRef?.current?.clientWidth);
    setIsResizing(false);

    window.addEventListener('resize', handleResizeWindow);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, [isResizing]);

  if (isLoading) return <div>로딩중...</div>;

  return (
    <PageContainer>
      <TopPostContainer ref={containerRef}>
        <Image
          src={post.image}
          width={postItemWidth / 3}
          height={(postItemWidth / 3) * 1.66}
          style={post.styleMap}
        />
        <TopPostContainerMeta>
          <TopPostContainerUserContainer>
            <Link to={`/user/${post.author.username}`}>
              <Avatar
                size={32}
                src={
                  post.author.image ||
                  'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                }
              />
            </Link>
            <div>
              <Link to={`/user/${post.author.username}`}>
                <TopPostContainerUsername>{post.author.username} </TopPostContainerUsername>
              </Link>
              {dayjs(post.createdAt).fromNow()}
            </div>
          </TopPostContainerUserContainer>

          <WeatherInformationWrapper>
            <Text color="black" size={22}>
              {(post.metaMap.isEvaluation && makeEvaluationEmojiMap(post.metaMap)) || ''}{' '}
            </Text>
            <Text color="black" size={22}>
              {post.title && `${post.title} °C `}
              <Text color="black" size={16}>
                (±{post.metaMap.diffTemperature} °C)
              </Text>
            </Text>
          </WeatherInformationWrapper>
        </TopPostContainerMeta>
      </TopPostContainer>

      <CommentsContainer>
        {commentsList.map(
          ({ _id, comment, createdAt, author, author: { username, image = '' } }) => (
            <CommentWrapper key={_id}>
              <div>
                <Avatar src={image} alt="profile" size={60} lazy username={username} />
                {currentUser.uid === author._id && <MyCommentWrapper>내 댓글</MyCommentWrapper>}
              </div>
              <TextWrapper>
                <NameWrapper paragraph>
                  {username}
                  {currentUser.uid === author._id && (
                    <ButtonWrapper
                      type="button"
                      onClick={() => {
                        setClickedCommentId(_id);
                        setDeleteModalVisible(true);
                      }}
                    >
                      <Icon name="delete" size={20} />
                    </ButtonWrapper>
                  )}
                </NameWrapper>
                <Text paragraph style={{ marginBottom: '6px' }}>
                  {comment}
                </Text>
                <Text paragraph style={{ opacity: 0.5 }}>
                  {dayjs(createdAt).fromNow()}
                </Text>
              </TextWrapper>
            </CommentWrapper>
          ),
        )}
      </CommentsContainer>
      <Modal
        maxWidth="90vw"
        backgroundColor="white"
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
      >
        <ModalQuestion>댓글을 지우시겠습니까?</ModalQuestion>
        <ModalBottomButtonContainer>
          <ModalButton border type="button" onClick={() => setDeleteModalVisible(false)}>
            취소
          </ModalButton>
          <ModalButton type="button" onClick={onDeleteClick}>
            삭제
          </ModalButton>
        </ModalBottomButtonContainer>
      </Modal>
      <InputContainer
        onSubmit={(e) => {
          e.preventDefault();
          onCommentButtonClick();
        }}
      >
        <CommentSubmitInput
          type="text"
          placeholder="댓글을 입력해주세요."
          onChange={handleChange}
          value={commentValue}
        />
        <CommentSubmitButton type="submit" height="100%">
          <Icon size={24} name="send" color="white" />
        </CommentSubmitButton>
      </InputContainer>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  min-height: 100%;
  max-height: calc(100vh - 58px);
  display: flex;
  flex-direction: column;
`;

const TopPostContainer = styled.div`
  display: flex;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey200};
`;

const TopPostContainerUserContainer = styled.div`
  padding: 8px 0;
  display: flex;
  gap: 8px;
  align-items: center;
`;

const TopPostContainerMeta = styled.div`
  display: flex;
  flex-direction: column;
`;

const TopPostContainerUsername = styled.h3`
  font-size: 16px;
  font-weight: 700;
`;

const WeatherInformationWrapper = styled.div`
  flex: 1;
  display: flex;
  gap: 8px;
`;

const InputContainer = styled.form`
  position: sticky;
  bottom: 0;
  height: 10vh;
  max-height: 63px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.04);
`;
const CommentSubmitInput = styled.input`
  padding: 0 16px;
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.grey300};
  border-radius: 0;
  display: block;
  flex: 1;
`;
const CommentSubmitButton = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0.2;
  background: ${({ theme }) => theme.colors.grey900};
  outline: 0;
  border: none;
  border-radius: 0;
`;

const CommentsContainer = styled.ul`
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CommentWrapper = styled.li`
  width: 90%;
  min-height: 110px;
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey100};
  padding: 15px 0;
  box-sizing: border-box;
`;
const MyCommentWrapper = styled.div`
  opacity: 0.5;
  font-size: 14px;
  text-align: center;
`;
const TextWrapper = styled.div`
  margin-left: 20px;
  width: 100%;
`;
const NameWrapper = styled(Text)`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 20px;
  height: 20px;
  margin-bottom: 8px;
`;
const ButtonWrapper = styled.button`
  border: none;
  background-color: #fff;
  height: 100%;
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
export default CommentsPage;
