import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { BiComment } from 'react-icons/bi';
import { BsSuitHeartFill, BsSuitHeart, BsXLg } from 'react-icons/bs';
import { useDoubleTap } from 'use-double-tap';
import { useParams, useHistory, useLocation } from 'react-router';
import Lottie from 'react-lottie';
import dayjs from 'dayjs';
import {
  setLike,
  setDislike,
  setFollow,
  setUnFollow,
  deletePost,
  createNotification,
} from '../utils/apis/snsApi';
import likeButtonLottie from '../assets/lotties/likeButton.json';
import { usePostContext } from '../contexts/PostProvider';
import { Image, Avatar, Text, Toast, Button, Modal } from '../components/base';
import { makeEvaluationEmoji } from '../utils/functions/weatherUtil';
import { useNavigationContext } from '../contexts/NavigationContext';
import { useLocalToken } from '../routes/utilRoutes/hooks';
import { useAuth } from '../contexts/AuthContext';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const UserPostsPage = () => {
  const { onMountPage, pageTypes } = useNavigationContext();
  const imageRef = useRef([]);
  const { userPosts } = usePostContext();
  const history = useHistory();
  const { currentUser } = useAuth();
  const location = useLocation();
  const containerRef = useRef(null);
  const { userName } = useParams();
  const [clickedImage, setClickedImage] = useState('');
  const [token] = useLocalToken();
  const [postItemWidth, setPostItemWidth] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const [pushedLikePostId, setPushedLikePostId] = useState(null);
  const [following, setFollowing] = useState(currentUser.following);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clickedPostId, setClickedPostId] = useState('');

  if (userPosts.length === 0) {
    history.push(`/user/${userName}`);
  }
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    setPosts([]);
    userPosts.map((post) => setPosts((prev) => [...prev, post.props.post]));
    setClickedImage(parseInt(location?.state?.split('-')[1], 10));
  }, []);

  useEffect(() => {
    setPostItemWidth(containerRef?.current?.clientWidth);
    setIsResizing(false);
  }, [isResizing]);

  const handleResizeWindow = useCallback(() => setIsResizing(true), []);

  useEffect(() => {
    onMountPage(pageTypes.USER_POSTS_PAGE);
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  const isLike = useCallback(
    (likes) => {
      return likes.some(({ user }) => user === currentUser.uid);
    },
    [currentUser.uid],
  );

  const isFollow = useCallback(
    (postUserId) => following.some(({ user }) => user === postUserId),
    [following],
  );

  const isMine = useCallback((postAuthorId) => postAuthorId === currentUser.uid, [currentUser.uid]);

  const handleLike = useCallback(
    async (postId, postAuthorId) => {
      if (postId) {
        const { data, error } = await setLike(token, postId);

        if (!error.code) {
          // 화면에 바로 좋아요 표시를 하기 위함
          setPosts((prev) => [
            ...prev.map((prevPost) =>
              prevPost._id === postId
                ? {
                    ...prevPost,
                    likes: [...prevPost.likes, { _id: data._id, user: currentUser.uid }],
                  }
                : prevPost,
            ),
          ]);

          await createNotification(token, {
            notificationType: 'LIKE',
            notificationTypeId: data._id,
            userId: postAuthorId,
            postId: data.post,
          });
        } else {
          Toast.show(error.message, 3000);
        }
        setPushedLikePostId(postId);
      }
    },
    [token, currentUser],
  );

  const handleDislike = useCallback(
    async (postId, postLikes) => {
      const { _id: likeId = null } = postLikes.find((like) => like.user === currentUser.uid);

      if (likeId) {
        const { error } = await setDislike(token, likeId);
        if (!error.code) {
          // 화면에 바로 좋아요 취소 표시하기 위함
          setPosts((prev) => [
            ...prev.map((prevPost) =>
              prevPost._id === postId
                ? { ...prevPost, likes: prevPost.likes.filter((like) => like._id !== likeId) }
                : prevPost,
            ),
          ]);
        } else {
          Toast.show(error.message, 3000);
        }
        setPushedLikePostId(null);
      }
    },
    [token, currentUser.uid],
  );

  const handleFollow = useCallback(
    async (authorId) => {
      if (authorId) {
        const { data, error } = await setFollow(token, authorId);

        if (!error.code) {
          setFollowing((prev) => [...prev, { user: authorId, _id: data._id }]);

          await createNotification(token, {
            notificationType: 'FOLLOW',
            notificationTypeId: data._id,
            userId: authorId,
            postId: null,
          });
        } else {
          Toast.show(error.message, 3000);
        }
      }
    },
    [token],
  );

  const handleUnFollow = useCallback(
    async (authorId) => {
      const { _id: unFollowId = null } = following.find(({ user }) => user === authorId);

      if (unFollowId) {
        const { error } = await setUnFollow(token, unFollowId);

        if (!error.code) {
          setFollowing((prev) => prev.filter(({ user }) => user !== authorId));
        } else {
          Toast.show(error.message, 3000);
        }
      }
    },
    [token, following],
  );

  const handleDeletePost = useCallback(async () => {
    if (clickedPostId) {
      const { error } = await deletePost(token, clickedPostId);
      if (!error.code) {
        setPosts((prev) => prev.filter(({ _id }) => _id !== clickedPostId));
      } else {
        Toast.show(error.message, 3000);
      }
    }
    setClickedPostId('');
    setDeleteModalVisible(false);
  }, [clickedPostId]);

  const handleMoveUserProfile = useCallback(
    (authorUsername) => {
      if (authorUsername) {
        history.push(`/user/${authorUsername}`);
      }
    },
    [history],
  );

  const handleMoveCommentPage = useCallback(
    (postId) => {
      if (postId) {
        history.push(`/comments/${postId}`);
      }
    },
    [history],
  );

  const { onClick: handleLikeDoubleTap } = useDoubleTap(({ postId, postLikes, postAuthorId }) => {
    if (isLike(postLikes)) {
      handleDislike(postId, postLikes);
    } else {
      handleLike(postId, postAuthorId);
    }
  });

  useEffect(() => {
    setFollowing(() => currentUser.following);
  }, [currentUser]);
  useEffect(() => {
    imageRef.current[clickedImage]?.scrollIntoView({ block: 'end' });
  }, [clickedImage]);

  return (
    <>
      <Container ref={containerRef}>
        {posts?.map(({ _id, image, title, createdAt, likes, comments, meta, author }, index) => {
          const metaData = JSON.parse(meta);
          return (
            <PostCardWrapper
              key={_id}
              // eslint-disable-next-line
              ref={(elem) => (imageRef.current[index] = elem)}
              onClick={() =>
                handleLikeDoubleTap({ postId: _id, postLikes: likes, postAuthorId: author._id })
              }
              width={postItemWidth}
            >
              <LottieWrapper>
                <Lottie
                  options={{
                    loop: false,
                    autoplay: false,
                    animationData: likeButtonLottie,
                    rendererSettings: {
                      preserveAspectRatio: 'xMidYMid slice',
                    },
                  }}
                  height={400}
                  width={400}
                  isStopped={pushedLikePostId !== _id}
                />
              </LottieWrapper>
              <Image
                lazy
                block
                width="100%"
                mode="cover"
                src={image || 'https://via.placeholder.com/200'}
                alt={title}
                placeholder="https://via.placeholder.com/200"
                threshold={0}
                style={{
                  filter: `brightness(${metaData.brightness}%) contrast(${metaData.contrast}%) saturate(${metaData.saturate}%) grayscale(${metaData.grayscale}%)`,
                  backgroundPosition: `${metaData.position}%`,
                }}
              />
              <PostUserWrapper onClick={() => handleMoveUserProfile(author.username)}>
                <Avatar
                  size={32}
                  src={
                    author.image ||
                    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                  }
                />
                <PostUserNameWrapper>
                  <Text paragraph color="white" strong size={16}>
                    {author.username}
                  </Text>
                  <Text paragraph color="white" size={12}>
                    {dayjs(createdAt).fromNow()}
                  </Text>
                </PostUserNameWrapper>
              </PostUserWrapper>

              {!isMine(author._id) && isFollow(author._id) && (
                <FollowButton
                  backgroundColor="black"
                  height="36px"
                  onClick={() => handleUnFollow(author._id)}
                >
                  <Text color="white" size={16}>
                    Un Follow
                  </Text>
                </FollowButton>
              )}

              {!isMine(author._id) && !isFollow(author._id) && (
                <FollowButton
                  backgroundColor="black"
                  height="36px"
                  onClick={() => handleFollow(author._id)}
                >
                  <Text color="white" size={16}>
                    Follow
                  </Text>
                </FollowButton>
              )}
              {isMine(author._id) && (
                <FollowButton
                  backgroundColor="transparent"
                  height="36px"
                  onClick={() => {
                    setClickedPostId(_id);
                    setDeleteModalVisible(true);
                  }}
                >
                  <BsXLg size="26" color="#A85E5E" />
                </FollowButton>
              )}

              <LikeCommentsIconWrapper>
                {isLike(likes) ? (
                  <BsSuitHeartFill
                    size="22"
                    color="red"
                    onClick={() => handleDislike(_id, likes)}
                  />
                ) : (
                  <BsSuitHeart size="22" color="red" onClick={() => handleLike(_id, author._id)} />
                )}

                <Text size={16} color="white">
                  {likes.length}
                </Text>

                <CommentsWrapper onClick={() => handleMoveCommentPage(_id)}>
                  <BiComment color="white" size="22" />

                  <Text size={16} color="white">
                    {comments.length}
                  </Text>
                </CommentsWrapper>
              </LikeCommentsIconWrapper>

              <WeatherInformationWrapper>
                <Text size={22}>{makeEvaluationEmoji(meta) || ''}</Text>
                <Text size={22} color="white">
                  {`${title} °C `}
                  <Text size={16} color="white">
                    (±{metaData.diffTemperature} °C)
                  </Text>
                </Text>
              </WeatherInformationWrapper>
            </PostCardWrapper>
          );
        })}
      </Container>
      <Modal
        maxWidth="90vw"
        backgroundColor="white"
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
      >
        <ModalQuestion>포스트를 지우시겠습니까?</ModalQuestion>
        <ModalBottomButtonContainer>
          <ModalButton border type="button" onClick={() => setDeleteModalVisible(false)}>
            취소
          </ModalButton>
          <ModalButton type="button" onClick={handleDeletePost}>
            삭제
          </ModalButton>
        </ModalBottomButtonContainer>
      </Modal>
    </>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px 0;
  margin: 0 10px;
  padding: 20px 0;
`;

const PostCardWrapper = styled.article`
  position: relative;
  display: flex;
  overflow: hidden;
  width: 100%;
  min-width: 100%;
  height: ${({ width }) => width * 1.66}px;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: inline-block;
    background: linear-gradient(rgba(0, 0, 0, 1), rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    opacity: 0.8;
  }
`;

const LottieWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  z-index: 1000;
`;

const PostUserWrapper = styled.div`
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  width: 100%;
  z-index: 1;
  top: 16px;
  left: 16px;
`;

const PostUserNameWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  margin-left: 16px;
  gap: 4px 0;
`;

const FollowButton = styled(Button)`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 1;
  padding: 16px;
`;

const LikeCommentsIconWrapper = styled.div`
  cursor: pointer;
  position: absolute;
  display: flex;
  align-items: center;
  left: 16px;
  bottom: 16px;
  z-index: 1;
  gap: 0 8px;
`;

const WeatherInformationWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px 0;
  right: 16px;
  bottom: 16px;
  z-index: 1;
`;

const CommentsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0 8px;
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

export default UserPostsPage;
