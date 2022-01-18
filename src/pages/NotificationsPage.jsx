import styled from '@emotion/styled';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import { io } from 'socket.io-client';
import dayjs from 'dayjs';
import { Avatar, Image, Skeleton } from '../components/base';
import { useAuth } from '../contexts/AuthContext';
import { useNavigationContext } from '../contexts/NavigationContext';
import { getStyleMapByMeta } from '../utils/functions/commonUtil';

const NotificationsPage = () => {
  const history = useHistory();

  const { currentUser, isLoading, onGetCurrentUser, onNotificationsSeen } = useAuth();
  const { onMountPage, pageTypes } = useNavigationContext();

  const asyncNotificationInit = useCallback(async () => {
    await onGetCurrentUser();
    onNotificationsSeen();
  }, [onGetCurrentUser, onNotificationsSeen]);

  useEffect(() => asyncNotificationInit(), []);
  useEffect(() => onMountPage(pageTypes.NOTIFICATIONS_PAGE), []);

  const handleFollowNotificationClick = (username) => history.push(`/user/${username}`);
  const handleMessageNotificationClick = () => console.log('message');
  const handleLikeNotificationClick = (postId) => history.push(`/comments/${postId}`);
  const handleCommentNotificationClick = (comment) => history.push(`/comments/${comment.post._id}`);

  const getHandleClick = ({ follow, message, like, comment }, username, postId) => {
    if (follow) return () => handleFollowNotificationClick(username);
    if (message) return handleMessageNotificationClick;
    if (like || like === null)
      return () =>
        handleLikeNotificationClick((like && like.post._id) || (like === null && postId));
    if (comment) return () => handleCommentNotificationClick(comment);
  };

  const getNotificationText = ({ follow, message, like, comment }) => {
    if (follow) return '나를 팔로우 했어요';
    if (message) return '나에게 메시지를 보냈어요';
    // 가끔 null로 오는 like도 처리 해놓음 기본 값 0
    if (like || like === null) return '나의 게시물을 픽했어요';
    if (comment)
      return (
        <>
          나의 클로젯 게시물에 &lsquo;<Strong>{comment.comment}</Strong>&lsquo; 라고 댓글을 남겼어요
        </>
      );
    return '알림을 보냈습니다';
  };

  if (isLoading)
    return (
      <>
        <SkeletonNotification />
        <SkeletonNotification />
        <SkeletonNotification />
        <SkeletonNotification />
        <SkeletonNotification />
        <SkeletonNotification />
        <SkeletonNotification />
        <SkeletonNotification />
        <SkeletonNotification />
        <SkeletonNotification />
      </>
    );

  if (currentUser.notifications.length === 0) return <EmptyNotificationsPage />;

  return (
    <div>
      {currentUser.notifications.map(
        ({
          author,
          seen,
          createdAt,
          follow = null,
          message = null,
          like = 0,
          comment = null,
          post = 0,
        }) => {
          return (
            <NotificationItem
              key={createdAt}
              seen={seen}
              onClick={getHandleClick({ follow, message, like, comment }, author.username, post)}
            >
              <Link to={`/user/${author.username}`} onClick={(e) => e.stopPropagation()}>
                <Avatar
                  size={42}
                  src={
                    author.image ||
                    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                  }
                />
              </Link>
              <NotificationText>
                <div style={{ marginBottom: 6 }}>
                  <Link to={`/user/${author.username}`}>
                    <Strong>{author.username}님</Strong>
                  </Link>
                  이 {getNotificationText({ follow, message, like, comment })}
                </div>
                <Time>{dayjs(createdAt).fromNow()}</Time>
              </NotificationText>

              {like ? (
                <Image
                  src={like.post.image}
                  width={(82 / 5) * 3}
                  height={82}
                  style={getStyleMapByMeta(like.post.meta)}
                />
              ) : null}
            </NotificationItem>
          );
        },
      )}
    </div>
  );
};

const EmptyNotificationsPage = () => {
  return (
    <EmptyNotificationsContainer>
      <EmptyNotificationsTitle> 알림이 없네요 🤔</EmptyNotificationsTitle>
      <div> 활동적으로 포스팅하시면 다른 분들의 이야기를 들어볼 수 있을 거에요</div>
      <Link to="/">
        <EmptyNotificationsButtoon> 홈으로 가기</EmptyNotificationsButtoon>
      </Link>
    </EmptyNotificationsContainer>
  );
};

const EmptyNotificationsContainer = styled.div`
  height: 100%;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.grey500};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
`;

const EmptyNotificationsTitle = styled.h1`
  color: ${({ theme }) => theme.colors.grey900};
  font-size: 18px;
`;

const EmptyNotificationsButtoon = styled.div`
  font-size: 16px;
  cursor: pointer;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.grey900};
  color: ${({ theme }) => theme.colors.white};
`;

const SkeletonNotification = () => (
  <div style={{ padding: 12 }}>
    <div style={{ display: 'flex', alignItem: 'center' }}>
      <div style={{ float: 'left', marginRight: 16 }}>
        <Skeleton.Circle size={60} />
      </div>
      <div style={{ float: 'left', width: '80%' }}>
        <Skeleton.Paragraph line={2} />
      </div>
      <div style={{ clear: 'both' }} />
    </div>
  </div>
);

const Strong = styled.strong`
  font-weight: 700;
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey50};
  background: ${({ theme }) => theme.colors.white};
  margin-bottom: 8px;
  padding-left: 16px;
`;

const NotificationText = styled.div`
  flex: 1;
  padding: 16px 16px 16px 0;
  min-height: 50px;
`;

const Time = styled.div`
  color: ${({ theme }) => theme.colors.grey400};
`;

export default NotificationsPage;
