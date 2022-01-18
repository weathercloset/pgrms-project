import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useHistory, useLocation } from 'react-router';
import { BsSuitHeartFill, BsSuitHeart } from 'react-icons/bs';
import { BiComment } from 'react-icons/bi';
import { useDoubleTap } from 'use-double-tap';
import dayjs from 'dayjs';
import Lottie from 'react-lottie';
import likeButtonLottie from '../assets/lotties/likeButton.json';
import {
  getPostsParts,
  setLike,
  setDislike,
  setFollow,
  setUnFollow,
  createNotification,
} from '../utils/apis/snsApi';
import { Image, Avatar, Text, Button, Toast, Skeleton } from '../components/base';
import { makeEvaluationEmoji } from '../utils/functions/weatherUtil';
import { getMetaData } from '../utils/functions/commonUtil';
import { useLocalToken } from '../routes/utilRoutes/hooks';
import { useAuth } from '../contexts/AuthContext';
import { useInfiniteScroll } from '../hooks';
import { useNavigationContext } from '../contexts/NavigationContext';

const relativeTime = require('dayjs/plugin/relativeTime');

dayjs.extend(relativeTime);

const ExplorePage = () => {
  const { onMountPage, pageTypes } = useNavigationContext();
  const { currentUser, onFollow, onUnfollow } = useAuth();
  const [token] = useLocalToken();
  const history = useHistory();
  const location = useLocation();
  const scrollTargetRef = useRef(null);
  const postRef = useRef([]);
  const containerRef = useRef(null);
  const [isFetching] = useInfiniteScroll(scrollTargetRef.current);
  const [pageInformation, setPageInformation] = useState({ offset: 0, limit: 5 });
  const [pushedLikePostId, setPushedLikePostId] = useState(null);
  const [hasLocationState, setHasLocationState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [postItemWidth, setPostItemWidth] = useState(0);
  const [isResizing, setIsResizing] = useState(false);
  const [posts, setPosts] = useState({
    data: [],
    totalCount: 0,
    error: { code: null, message: null },
  });

  const isLast = useCallback(() => {
    const { offset, limit } = pageInformation;
    const { totalCount = 0 } = posts;

    return totalCount <= limit || totalCount <= offset;
  }, [pageInformation, posts]);

  const isLike = useCallback(
    (likes) => {
      return likes.some(({ user }) => user === currentUser.uid);
    },
    [currentUser.uid],
  );

  const isFollow = useCallback(
    (postUserId) => currentUser.following.some(({ user }) => user === postUserId),
    [currentUser.following],
  );

  const isMine = useCallback((postAuthorId) => postAuthorId === currentUser.uid, [currentUser.uid]);

  const getPostsInformation = useCallback(async () => {
    let data = [];
    let error = { code: null, message: null };

    setIsLoading(true);

    if (location.state?.postId) {
      data = location.state.posts;
    } else {
      const res = await getPostsParts(pageInformation);
      data = res.data;
      error = res.error;
    }

    if (!error.code) {
      if (data?.length > 0) {
        setPosts((prev) => ({
          ...prev,
          data: [...prev.data, ...data],
          totalCount: data[0]?.channel.posts.length,
        }));
      }

      if (location.state?.postId) {
        setHasLocationState(true);
      }
    } else {
      Toast.show(error.message, 3000);
    }

    setIsLoading(false);
  }, [pageInformation, location]);

  const handleLike = useCallback(
    async (postId, postAuthorId) => {
      if (postId) {
        const { data, error } = await setLike(token, postId);

        if (!error.code) {
          // 화면에 바로 좋아요 표시를 하기 위함
          setPosts((prev) => ({
            ...prev,
            data: prev.data.map((prevPost) =>
              prevPost._id === postId
                ? {
                    ...prevPost,
                    likes: [...prevPost.likes, { _id: data._id, user: currentUser.uid }],
                  }
                : prevPost,
            ),
          }));

          await createNotification(token, {
            notificationType: 'LIKE',
            notificationTypeId: data._id,
            userId: postAuthorId,
            postId,
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
          setPosts((prev) => ({
            ...prev,
            data: prev.data.map((prevPost) =>
              prevPost._id === postId
                ? { ...prevPost, likes: prevPost.likes.filter((like) => like._id !== likeId) }
                : prevPost,
            ),
          }));
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
          onFollow({ userId: authorId, followId: data._id });

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
      const { _id: unfollowId = null } = currentUser.following.find(
        ({ user }) => user === authorId,
      );

      if (unfollowId) {
        const { error } = await setUnFollow(token, unfollowId);

        if (!error.code) {
          onUnfollow({ unfollowId });
        } else {
          Toast.show(error.message, 3000);
        }
      }
    },
    [token, currentUser.following],
  );

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
    getPostsInformation();
  }, [getPostsInformation]);

  useEffect(() => {
    if (isFetching && !isLast() && !isLoading && !location.state?.postId && posts.data.length > 0) {
      setPageInformation((prev) => ({ ...prev, offset: prev.offset + prev.limit }));
    }
  }, [isFetching, pageInformation, isLast, isLoading, location, posts]);

  useEffect(() => {
    setPostItemWidth(containerRef?.current?.clientWidth);
    setIsResizing(false);
  }, [isResizing]);

  const handleResizeWindow = useCallback(() => setIsResizing(true), []);

  useEffect(() => {
    onMountPage(pageTypes.EXPLORE_PAGE);
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  useEffect(() => {
    const nowPostIndex = posts.data.findIndex((post) => post._id === location.state?.postId);
    if (nowPostIndex !== -1) {
      postRef.current[nowPostIndex]?.scrollIntoView({ block: 'end' });
    }

    return () => {
      setHasLocationState(false);
    };
  }, [hasLocationState]);

  return (
    <Container ref={containerRef}>
      {posts.data.length === 0 && !isLoading && (
        <EmptyPostsWrapper>옷장이 비어있어요 😥</EmptyPostsWrapper>
      )}
      {posts.data?.map(({ _id, image, title, createdAt, likes, comments, meta, author }, index) => {
        const parsedMeta = getMetaData(meta);
        return (
          <PostCardWrapper
            key={_id}
            onClick={() =>
              handleLikeDoubleTap({ postId: _id, postLikes: likes, postAuthorId: author._id })
            }
            ref={(element) => {
              postRef.current[index] = element;
              return true;
            }}
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
                filter: `brightness(${parsedMeta.brightness}%) contrast(${parsedMeta.contrast}%) saturate(${parsedMeta.saturate}%) grayscale(${parsedMeta.grayscale}%)`,
                backgroundPosition: `${parsedMeta.position}%`,
              }}
            />

            <PostUserWrapper onClick={() => handleMoveUserProfile(author.username)}>
              <AvatarWrapper>
                <Avatar
                  size={32}
                  src={
                    author.image ||
                    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                  }
                />
              </AvatarWrapper>
              <PostUserNameWrapper>
                <EllipsesText color="white" strong size={16}>
                  {author.username}
                </EllipsesText>
                <Text color="white" size={12}>
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

            <LikeCommentsIconWrapper>
              {isLike(likes) ? (
                <BsSuitHeartFill size="22" color="red" onClick={() => handleDislike(_id, likes)} />
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
                  (±{getMetaData(meta).diffTemperature} °C)
                </Text>
              </Text>
            </WeatherInformationWrapper>
          </PostCardWrapper>
        );
      })}
      {isLoading && (
        <SkeletonWrapper>
          <SkeletonItem width={postItemWidth} height={postItemWidth * 1.66 || '1px'} />
        </SkeletonWrapper>
      )}

      <ScrollTarget ref={scrollTargetRef} />
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px 0;
  margin: 0 16px;
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
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
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
  z-index: 100;
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
  width: 100%;
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

const ScrollTarget = styled.div`
  width: 100%;
  height: 2px;
`;

const EmptyPostsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;

const CommentsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0 8px;
`;

const EllipsesText = styled(Text)`
  max-width: 50%;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const AvatarWrapper = styled.div`
  display: flex;
`;

const SkeletonWrapper = styled.div`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 16px;
`;

const SkeletonItem = styled(Skeleton.Box)`
  width: ${({ width }) => width}px;
  min-width: ${({ width }) => width}px;
  height: ${({ width }) => width * 1.66}px;
`;

export default ExplorePage;
