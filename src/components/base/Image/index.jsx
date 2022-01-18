import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { useState, useRef, useEffect } from 'react';

let observer = null;
const LOAD_IMG_EVENT_TYPE = 'loadImage';

const onIntersection = (entries, io) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      io.unobserve(entry.target);
      entry.target.dispatchEvent(new CustomEvent(LOAD_IMG_EVENT_TYPE));
    }
  });
};

const Image = ({
  lazy,
  threshold = 0.5,
  placeholder,
  src,
  block,
  width,
  height,
  imageClass,
  alt,
  onClick = () => {},
  mode,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  const imageStyle = {
    display: block ? 'block' : undefined,
    width,
    height,
    objectFit: mode, // cover, fill, contain
  };
  useEffect(() => {
    if (!lazy) {
      setLoaded(true);
      return;
    }

    const handleLoadImage = () => setLoaded(true);

    const imgElement = imgRef.current;
    if (imgElement) imgElement.addEventListener(LOAD_IMG_EVENT_TYPE, handleLoadImage);
    return () => {
      if (imgElement) imgElement.removeEventListener(LOAD_IMG_EVENT_TYPE, handleLoadImage);
    };
  }, [lazy]);

  useEffect(() => {
    if (!lazy) return;

    observer = new IntersectionObserver(onIntersection, { threshold });
    if (imgRef.current) observer.observe(imgRef.current);
  }, [lazy, threshold]);

  return (
    // eslint-disable-next-line
    <ImageWrapper
      ref={imgRef}
      onClick={onClick}
      className={imageClass}
      src={loaded ? src : placeholder}
      alt={alt}
      style={{ ...props.style, ...imageStyle }}
    />
  );
};

const ImageWrapper = styled.div`
  background-image: ${({ src }) => `url(${src})`};
  background-size: cover;
`;

Image.propTypes = {
  lazy: PropTypes.bool,
  threshold: PropTypes.number,
  src: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  alt: PropTypes.string,
  mode: PropTypes.string,
};

export default Image;
