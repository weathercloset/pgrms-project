import styled from '@emotion/styled';
import { useMemo } from 'react';
import FluxProvider from './FluxProvider';

const AlignToCSSValue = {
  top: 'flex-start',
  middle: 'center',
  bottom: 'flex-end',
};

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  box-sizing: border-box;

  justify-content: ${({ justify }) => justify};
  align-items: ${({ align }) => AlignToCSSValue[align]};
`;

const Row = ({ children, justify, align, gutter, ...props }) => {
  const gutterStyle = useMemo(() => {
    if (Array.isArray(gutter)) {
      const horizontalGutter = gutter[0];
      const verticalGutter = gutter[1];
      return {
        marginTop: `-${verticalGutter / 2}px`,
        marginBottom: `-${verticalGutter / 2}px`,
        marginLeft: `-${horizontalGutter / 2}px`,
        marginRight: `-${horizontalGutter / 2}px`,
      };
    }
    return {
      marginLeft: `-${gutter / 2}px`,
      marginRight: `-${gutter / 2}px`,
    };
  }, [gutter]);

  return (
    <FluxProvider gutter={gutter}>
      <StyledRow
        {...props}
        align={align}
        justify={justify}
        style={{ ...props.style, ...gutterStyle }}
      >
        {children}
      </StyledRow>
    </FluxProvider>
  );
};

export default Row;
