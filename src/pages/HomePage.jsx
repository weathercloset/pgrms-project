import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useHistory } from 'react-router';
import styled from '@emotion/styled';
import Lottie from 'react-lottie';
import moreLottie from '../assets/lotties/more.json';
import { Text, Image, Button, Toast, Skeleton } from '../components/base';
import { useWeatherContext } from '../contexts/WeatherProvider';
import { getPosts } from '../utils/apis/snsApi';
import { makeEvaluationEmoji } from '../utils/functions/weatherUtil';
import { isEmptyObject, getMetaData } from '../utils/functions/commonUtil';
import { useAuth } from '../contexts/AuthContext';
import { useNavigationContext } from '../contexts/NavigationContext';
import { EvaluationModal } from '../components/domain';

const HomePage = () => {
  const initNotFinishedEvaluation = useMemo(
    () => ({
      _id: '',
      title: '',
      meta: '',
      image: 'https://via.placeholder.com/200',
    }),
    [],
  );
  const [isResizing, setIsResizing] = useState(false);
  const [postItemWidth, setPostItemWidth] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [posts, setPosts] = useState({
    nowTemperaturePosts: [],
    trendingPosts: [],
  });
  const [notFinishedEvaluation, setNotFinishedEvaluation] = useState(initNotFinishedEvaluation);
  const [isLoading, setIsLoading] = useState(true);
  const { onMountPage, pageTypes } = useNavigationContext();
  const history = useHistory();
  const { currentUser } = useAuth();

  const postItemWrapperRef = useRef(null);

  const {
    weatherInformation: { weather, error },
  } = useWeatherContext();
  const { nowTemp = '-', minTemp = 0, maxTemp = 0, recommendationSentence = '' } = weather;

  const getPostsInformation = useCallback(async () => {
    setIsLoading(true);

    const { data, error: postError } = await getPosts();

    if (postError.code) {
      Toast.show(postError.message, 3000);
      setPosts({
        nowTemperaturePosts: [],
        trendingPosts: [],
      });
      setIsLoading(false);
    } else if (nowTemp !== '-' && nowTemp !== undefined) {
      const nowTemperaturePosts =
        (isEmptyObject(error) && data.filter(({ title }) => title === String(nowTemp))) || [];
      const trendingPosts = data.sort((a, b) => b.likes.length - a.likes.length) || [];
      const notFinishedEvaluationData = data.filter(({ meta, author }) => {
        const nowMeta = getMetaData(meta);
        return nowMeta.isEvaluation === false && author._id === currentUser.uid;
      })[0];

      setNotFinishedEvaluation(notFinishedEvaluationData || initNotFinishedEvaluation);
      setPosts({
        nowTemperaturePosts,
        trendingPosts,
      });
      setIsLoading(false);
    }
  }, [nowTemp, error, currentUser.uid, initNotFinishedEvaluation]);

  useEffect(() => {
    getPostsInformation();
  }, [getPostsInformation]);

  const handleClickEvaluation = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleMoveUserPage = useCallback(
    (username) => {
      history.push(`/user/${username}`);
    },
    [history],
  );

  const handleMoveExplorePage = useCallback(() => {
    history.push(`/explore`);
  }, [history]);

  useEffect(() => {
    setPostItemWidth(postItemWrapperRef?.current?.clientWidth * 0.4);
    setIsResizing(false);
  }, [isResizing]);

  const handleResizeWindow = useCallback(() => setIsResizing(true), []);

  useEffect(() => {
    onMountPage(pageTypes.HOME_PAGE);
    window.addEventListener('resize', handleResizeWindow);
    return () => {
      window.removeEventListener('resize', handleResizeWindow);
    };
  }, []);

  const handlePostItemClick = useCallback(
    (postId, nowPosts) => {
      history.push({
        pathname: '/explore',
        state: { postId, posts: nowPosts },
      });
    },
    [history],
  );

  return (
    <Container>
      {!isEmptyObject(error) ? (
        <EmptyWeatherWrapper>
          <Text paragraph>날씨 정보에 문제가 발생했습니다 😥</Text>
        </EmptyWeatherWrapper>
      ) : (
        <WeatherInformationWrapper>
          <Text paragraph size={48}>
            {nowTemp}°C
          </Text>

          <Text paragraph size={22}>
            <Text color="blue">{minTemp}°C</Text> / <Text color="red">{maxTemp}°C</Text>
          </Text>

          <Text paragraph size={16} style={{ whiteSpace: 'pre-wrap' }}>
            {recommendationSentence}
          </Text>
          {notFinishedEvaluation._id ? (
            <EvaluationButton
              type="button"
              onClick={handleClickEvaluation}
              width="calc(100% - 16px)"
              height="56px"
              backgroundColor="black"
              color="white"
            >
              평가하기
            </EvaluationButton>
          ) : (
            <EvaluationButton
              type="button"
              onClick={() => handleMoveUserPage(currentUser.username)}
              width="calc(100% - 16px)"
              height="56px"
              backgroundColor="black"
              color="white"
            >
              {`나의 ${nowTemp}°C Closet 바로가기`}
            </EvaluationButton>
          )}
        </WeatherInformationWrapper>
      )}

      <PostTitleWrapper>
        <Text size={22} strong>
          {nowTemp}°C Closet
        </Text>

        <Button onClick={handleMoveExplorePage}>+ 더보기</Button>
      </PostTitleWrapper>

      <PostWrapper>
        {isLoading && (
          <>
            <PostItem width={postItemWidth}>
              <SkeletonItem width="100%" height="100%" />
            </PostItem>
            <PostItem width={postItemWidth}>
              <SkeletonItem width="100%" height="100%" />
            </PostItem>
          </>
        )}
        {!isLoading && posts.nowTemperaturePosts.length === 0 && (
          <EmptyPostsWrapper>아직 {nowTemp}°C의 옷장이 비어있어요 😥</EmptyPostsWrapper>
        )}
        {!isLoading &&
          posts.nowTemperaturePosts.length > 0 &&
          posts.nowTemperaturePosts.map(({ _id, image, title, author, meta }) => {
            const parsedMeta = getMetaData(meta);
            return (
              <PostItem
                width={postItemWidth}
                key={_id}
                onClick={() => handlePostItemClick(_id, posts.nowTemperaturePosts)}
              >
                <Image
                  lazy
                  block
                  width="100%"
                  height="100%"
                  mode="cover"
                  src={image || ''}
                  alt={title}
                  placeholder="https://via.placeholder.com/200"
                  threshold={0}
                  style={{
                    filter: `brightness(${parsedMeta.brightness}%) contrast(${parsedMeta.contrast}%) saturate(${parsedMeta.saturate}%) grayscale(${parsedMeta.grayscale}%)`,
                    backgroundPosition: `${parsedMeta.position}%`,
                  }}
                />

                <EvaluationTextWrapper>
                  <EllipsesText
                    size={16}
                    color="white"
                    onClick={() => handleMoveUserPage(author.username)}
                  >
                    {author.username}&apos;s
                  </EllipsesText>

                  <Text size={16} color="white">
                    {makeEvaluationEmoji(meta)}
                  </Text>
                </EvaluationTextWrapper>
              </PostItem>
            );
          })}

        {posts.nowTemperaturePosts && posts.nowTemperaturePosts.length > 0 && (
          <LottieWrapper
            width={postItemWrapperRef?.current?.clientWidth * 0.4}
            onClick={handleMoveExplorePage}
          >
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: moreLottie,
                rendererSettings: {
                  preserveAspectRatio: 'xMidYMid slice',
                },
              }}
              height="20%"
              width="100%"
              isStopped={!(posts.nowTemperaturePosts && posts.nowTemperaturePosts.length)}
            />
          </LottieWrapper>
        )}
      </PostWrapper>

      <PostTitleWrapper>
        <Text size={22} strong>
          Trending
        </Text>
      </PostTitleWrapper>

      <PostWrapper ref={postItemWrapperRef}>
        {isLoading && (
          <>
            <PostItem width={postItemWidth}>
              <SkeletonItem width="100%" height="100%" />
            </PostItem>
            <PostItem width={postItemWidth}>
              <SkeletonItem width="100%" height="100%" />
            </PostItem>
          </>
        )}
        {!isLoading && posts.trendingPosts.length === 0 && (
          <EmptyPostsWrapper>옷장이 비어있어요 😥</EmptyPostsWrapper>
        )}
        {!isLoading &&
          posts.trendingPosts.length > 0 &&
          posts.trendingPosts.map(({ _id, image, title, author, meta }) => {
            const parsedMeta = getMetaData(meta);
            return (
              <PostItem
                width={postItemWidth}
                key={_id}
                onClick={() => handlePostItemClick(_id, posts.trendingPosts)}
              >
                <Image
                  lazy
                  block
                  width="100%"
                  height="100%"
                  mode="cover"
                  src={image || ''}
                  alt={title}
                  placeholder="https://via.placeholder.com/200"
                  threshold={0}
                  style={{
                    filter: `brightness(${parsedMeta.brightness}%) contrast(${parsedMeta.contrast}%) saturate(${parsedMeta.saturate}%) grayscale(${parsedMeta.grayscale}%)`,
                    backgroundPosition: `${parsedMeta.position}%`,
                  }}
                />

                <EvaluationTextWrapper>
                  <EllipsesText
                    size={16}
                    color="white"
                    onClick={() => handleMoveUserPage(author.username)}
                  >
                    {author.username}&apos;s
                  </EllipsesText>

                  <Text size={16} color="white">
                    {makeEvaluationEmoji(meta)}
                  </Text>
                </EvaluationTextWrapper>
              </PostItem>
            );
          })}
      </PostWrapper>

      <EvaluationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        afterEvaluationCallback={getPostsInformation}
        notFinishedEvaluation={notFinishedEvaluation}
      />
    </Container>
  );
};

const Container = styled.section``;

const WeatherInformationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  margin-bottom: 24px;
  padding: 0 16px;
`;

const PostWrapper = styled.div`
  display: flex;
  margin-bottom: 24px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
`;

const PostItem = styled.div`
  scroll-snap-align: start;
  position: relative;
  display: flex;
  overflow: hidden;
  width: ${({ width }) => width}px;
  min-width: ${({ width }) => width}px;
  height: ${({ width }) => width * 1.66}px;
  cursor: pointer;
  padding-left: 16px;

  &:after {
    margin-left: 16px;
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: inline-block;
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
    opacity: 0.5;
  }
`;

const PostTitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 16px;
  margin-bottom: 16px;
  padding: 0 16px;
`;

const EvaluationButton = styled(Button)`
  width: 100%;
  padding: 16px;
`;

const EmptyPostsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 300px;
`;

const EvaluationTextWrapper = styled.div`
  display: flex;
  position: absolute;
  bottom: 8px;
  left: 24px;
  z-index: 99;
  width: 100%;
`;

const EllipsesText = styled(Text)`
  cursor: pointer;
  max-width: 55%;
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 8px;
`;

const EmptyWeatherWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 200px;
`;

const LottieWrapper = styled.div`
  position: relative;
  display: flex;
  overflow: hidden;
  width: ${({ width }) => width}px;
  min-width: ${({ width }) => width}px;
  height: ${({ width }) => width * 1.66}px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
`;

const SkeletonItem = styled(Skeleton.Box)`
  width: ${({ width }) => width}px;
  min-width: ${({ width }) => width}px;
  height: ${({ width }) => width * 1.66}px;
  margin-left: 16px;
`;

export default HomePage;
