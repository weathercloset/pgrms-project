import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useLocalToken } from '../../../routes/utilRoutes/hooks';
import { createNotification, setFollow, setUnFollow } from '../../../utils/apis/snsApi';
import { Toast } from '../../base';

const FollowButton = ({ id, getUserDataAsync, pageUserData }) => {
  const { currentUser } = useAuth();
  const { following } = currentUser;
  const [followingList, setFollowingList] = useState([]);
  const [isFollow, setIsFollow] = useState();
  const [token] = useLocalToken();

  // 팔로우 했는지 제크하는 확인하는 부분
  const checkFollow = useCallback(() => {
    setIsFollow(following.some((followingArray) => followingArray.user === id && true));
  }, [following, id]);

  const handleFollow = useCallback(async () => {
    const { data, error } = await setFollow(token, id);
    if (!error.code) {
      await getUserDataAsync();
      await setIsFollow(!isFollow);
      await setFollowingList((prev) => [...prev, { _id: data._id, user: id }]);

      await createNotification(token, {
        notificationType: 'FOLLOW',
        notificationTypeId: data._id,
        userId: pageUserData._id,
        postId: null,
      });
    } else {
      Toast.show(error.message, 3000);
    }
  }, [id, token, getUserDataAsync, isFollow]);

  const handleUnFollow = useCallback(async () => {
    const [getFollowId] = followingList.filter(({ user }) => pageUserData._id === user);
    const followId = getFollowId._id;
    const { error } = await setUnFollow(token, followId);
    if (!error.code) {
      await getUserDataAsync();
      await setIsFollow(!isFollow);
      await setFollowingList((prev) => prev.filter(({ user }) => user !== id));
    } else {
      Toast.show(error.message, 3000);
    }
  }, [token, getUserDataAsync, isFollow, followingList, pageUserData._id, id]);

  useEffect(() => {
    checkFollow();
    setFollowingList([...following]);
  }, [checkFollow, following]);

  return (
    <div>
      {isFollow ? (
        <Following type="button" onClick={handleUnFollow}>
          Following
        </Following>
      ) : (
        <Follow type="button" onClick={handleFollow}>
          Follow
        </Follow>
      )}
    </div>
  );
};

const Following = styled.button`
  width: 350px;
  height: 40px;
  border: 2px solid #ddd;
  background-color: #fffdfa;
  cursor: pointer;
  &:hover {
    background-color: #f7e3c7;
  }
`;
const Follow = styled.button`
  width: 350px;
  height: 40px;
  border: 2px solid #ddd;
  background-color: #f7e3c7;
  cursor: pointer;
  &:hover {
    background-color: #fffdfa;
  }
`;
export default FollowButton;
