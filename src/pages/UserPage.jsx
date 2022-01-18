import styled from '@emotion/styled';
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useHistory } from 'react-router';
import { Avatar, Tab, Image, Icon, Text } from '../components/base';
import { EditButton, FollowButton } from '../components/domain';
import { useAuth } from '../contexts/AuthContext';
import { useNavigationContext } from '../contexts/NavigationContext';
import { usePostContext } from '../contexts/PostProvider';
import { useWeatherContext } from '../contexts/WeatherProvider';
import { getUsersData, getUserPosts, getPostData } from '../utils/apis/snsApi';

const UserPage = () => {
  const { onMountPage, pageTypes } = useNavigationContext();
  const { onAddUserPosts } = usePostContext();
  const { userName } = useParams();
  const history = useHistory();
  const { currentUser, onGetCurrentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [temperature, setTemperature] = useState(0);
  const [likePosts, setLikePosts] = useState([]);
  const [pageUserData, setPageUserData] = useState({
    _id: '',
    image: '',
    followers: [],
    following: [],
    likes: [],
    posts: [],
  });
  const {
    weatherInformation: { weather },
  } = useWeatherContext();
  const { nowTemp = 0 } = weather;
  const defaultImage = 'https://via.placeholder.com/70x70?text=Profile';

  const getUserDataAsync = useCallback(async () => {
    const { data } = await getUsersData(userName);
    const [userInfo] = data.filter(({ username }) => username && userName === username);
    if (userInfo?._id) {
      const userPostsResult = await getUserPosts(userInfo._id);
      setPageUserData((prev) => ({
        ...prev,
        _id: userInfo?._id,
        image: userInfo?.image,
        followers: userInfo?.followers || [],
        following: userInfo?.following || [],
        likes: userInfo?.likes || [],
        posts: userPostsResult?.data || [],
      }));
      setTemperature(nowTemp || 0);
    }
    setIsLoading(false);
  }, [userName, nowTemp]);

  const getLikePostsAsync = useCallback(async () => {
    if (pageUserData._id === currentUser.uid) {
      Object.keys(currentUser.likesMap).forEach(async (key) => {
        if (key !== 'undefined') {
          const { data } = await getPostData(key);
          setLikePosts((prev) => [...prev, data]);
        }
      });
    }
  }, [currentUser.uid, pageUserData._id, currentUser.likesMap]);

  useEffect(() => {
    onMountPage(pageTypes.USER_PAGE);
    onGetCurrentUser();

    return onGetCurrentUser;
  }, []);

  useEffect(() => {
    if (weather) {
      getUserDataAsync();
      getLikePostsAsync();
    }
  }, [getUserDataAsync, getLikePostsAsync, weather]);

  const getTempPosts = (postLists = [], handlePostClick) =>
    postLists
      .filter(
        (post) =>
          parseInt(post?.title || '0', 10) > temperature - 2 &&
          parseInt(post?.title || '0', 10) < temperature + 2,
      )
      .filter((post, idx, lists) => lists.findIndex((item) => item._id === post._id) === idx)
      .map((post, index) => {
        const metaData = JSON.parse(post.meta);
        return (
          <Image
            width="33%"
            lazy
            post={post}
            height="216px"
            mode="cover"
            onClick={handlePostClick}
            block
            placeholder="https://via.placeholder.com/200"
            src={`${post.image}`}
            key={post._id}
            alt={`image-${index}`}
            style={{
              filter: `brightness(${metaData.brightness}%) contrast(${metaData.contrast}%) saturate(${metaData.saturate}%) grayscale(${metaData.grayscale}%)`,
              backgroundPosition: `${metaData.position}%`,
            }}
          />
        );
      });
  const onPostClick = (e) => {
    onAddUserPosts(getTempPosts(pageUserData.posts));
    history.push({ pathname: `/user/${userName}/post`, state: e.target.getAttribute('alt') });
  };
  const onLickPostClick = (e) => {
    onAddUserPosts(getTempPosts(likePosts));
    history.push({ pathname: `/user/${userName}/post`, state: e.target.getAttribute('alt') });
  };
  useEffect(() => {
    return () => {
      setLikePosts([]);
    };
  }, []);
  const handleTemperature = (temp) => {
    let nextTemperature = temperature + temp;
    if (nextTemperature > 40 || nextTemperature < -20) {
      nextTemperature = temperature;
    }
    setTemperature(nextTemperature);
  };
  if (isLoading) {
    return <div>로딩중...</div>;
  }
  if (!pageUserData?._id && !isLoading) {
    return <div> {userName} 라는 username을 가진 사용자가 없어요 </div>;
  }

  return (
    <MainContainer>
      <UserPageContainer>
        <Avatar
          src={pageUserData.image ? pageUserData.image : defaultImage}
          alt="profile"
          size={80}
        />
        <DetailsContainer className="details">
          <UserDetailsTab>
            Followers
            <Text paragraph style={{ marginTop: 8, fontWeight: 'bold' }}>
              {pageUserData.followers.length}
            </Text>
          </UserDetailsTab>
          <UserDetailsTab>
            Following
            <Text paragraph style={{ marginTop: 8, fontWeight: 'bold' }}>
              {pageUserData.following.length}
            </Text>
          </UserDetailsTab>
          <UserDetailsTab>
            Pick
            <Text paragraph style={{ marginTop: 8, fontWeight: 'bold' }}>
              {pageUserData.likes.length}
            </Text>
          </UserDetailsTab>
        </DetailsContainer>
      </UserPageContainer>

      {pageUserData._id === currentUser.uid ? (
        <>
          <ButtonContainer>
            <EditButton userName={userName} />
          </ButtonContainer>
          <Tab>
            <Tab.Item title="Closet" index="page_user_tab" style={{ backgroundColor: '#fafafa' }}>
              <TemperatureTab>
                <Button type="button" onClick={() => handleTemperature(-3)}>
                  <Icon name="chevron-left" size={25} />
                </Button>
                <Text strong>{temperature} ℃ Closet</Text>
                <Button type="button" onClick={() => handleTemperature(3)}>
                  <Icon name="chevron-right" size={25} />
                </Button>
              </TemperatureTab>
              <PostsContainer>{getTempPosts(pageUserData.posts, onPostClick)}</PostsContainer>
            </Tab.Item>
            <Tab.Item title="Pick" index="user_like_tab" style={{ backgroundColor: '#fafafa' }}>
              <TemperatureTab>
                <Button type="button" onClick={() => handleTemperature(-3)}>
                  <Icon name="chevron-left" size={25} />
                </Button>
                <Text strong>{temperature} ℃ Pick</Text>
                <Button type="button" onClick={() => handleTemperature(3)}>
                  <Icon name="chevron-right" size={25} />
                </Button>
              </TemperatureTab>
              <PostsContainer>{getTempPosts(likePosts, onLickPostClick)}</PostsContainer>
            </Tab.Item>
          </Tab>
        </>
      ) : (
        <>
          <ButtonContainer>
            <FollowButton
              id={pageUserData._id}
              getUserDataAsync={getUserDataAsync}
              pageUserData={pageUserData}
            />
          </ButtonContainer>
          <Tab>
            <Tab.Item
              title="Closet"
              index="page_user_tab"
              style={{ width: '100%', cursor: 'default', backgroundColor: '#fafafa' }}
            >
              <TemperatureTab>
                <Button type="button" onClick={() => handleTemperature(-3)}>
                  <Icon name="chevron-left" size={25} />
                </Button>
                <Text strong>{temperature} ℃ Closet</Text>
                <Button type="button" onClick={() => handleTemperature(3)}>
                  <Icon name="chevron-right" size={25} />
                </Button>
              </TemperatureTab>
              <PostsContainer>{getTempPosts(pageUserData.posts, onPostClick)}</PostsContainer>
            </Tab.Item>
          </Tab>
        </>
      )}
    </MainContainer>
  );
};

const MainContainer = styled.div`
  margin: 0;
`;
const UserPageContainer = styled.div`
  display: flex;
  height: 100px;
  width: 100%;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 10px 0;
`;
const DetailsContainer = styled.div`
  display: flex;
  margin: 0 30px;
`;
const UserDetailsTab = styled.div`
  margin: 0 10px;
  text-align: center;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;
const TemperatureTab = styled.nav`
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(205, 202, 182, 0.87);
`;
const Button = styled.div`
  background-color: none;
  margin: 0 20px;
`;
const PostsContainer = styled.section`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-left: 0.5%;
`;

export default UserPage;
