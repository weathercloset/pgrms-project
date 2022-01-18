import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import ImageComponent from '../Image';
import AvatarGroup from './AvatarGroup';

const ShapeToCssValue = {
  circle: '50%',
  round: '4px',
  square: '0px',
};

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-block;
  border: 1px solid #ededed;
  border-radius: ${({ shape = '50%' }) => ShapeToCssValue[shape]};
  background-color: #eee;
  overflow: hidden;

  > img {
    transition: opacity 0.2s ease-out;
    border-radius: ${({ shape = '50%' }) => ShapeToCssValue[shape]};
  }
`;

const Avatar = ({
  lazy,
  threshold,
  src,
  size = 70,
  shape = 'circle', // round, square
  placeholder,
  alt,
  mode = 'cover',
  username,
  __TYPE,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => setLoaded(true);
  }, [src]);

  const goUserPage = (username) => {
    if (username) {
      history.push(`/user/${username}`);
    }
  };

  return (
    <AvatarWrapper {...props} shape={shape}>
      <ImageComponent
        block
        lazy={lazy}
        threshold={threshold}
        width={size}
        height={size}
        src={src}
        placeholder={placeholder}
        alt={alt}
        onClick={() => goUserPage(username)}
        mode={mode}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </AvatarWrapper>
  );
};

Avatar.defaultProps = {
  __TYPE: 'Avatar',
};

Avatar.propTypes = {
  lazy: PropTypes.bool,
  threshold: PropTypes.number,
  src: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  shape: PropTypes.string,
  placeholder: PropTypes.string,
  alt: PropTypes.string,
  mode: PropTypes.string,
  __TYPE: PropTypes.oneOf(['Avatar']),
};

Avatar.Group = AvatarGroup;

export default Avatar;
