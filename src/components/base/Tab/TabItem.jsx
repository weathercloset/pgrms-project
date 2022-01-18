import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import Text from '../Text';

const TabItemWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 45px;
  font-size: 16px;
  color: ${({ active, theme }) => (active ? theme.colors.grey900 : theme.colors.grey500)};
  background-color: ${({ active }) => (active ? '#ffffff' : '#ffffff')};
  border-bottom: ${({ active }) => (active ? '3px solid black' : '2px solid #ddd')};
  cursor: pointer;
  box-sizing: border-box;
`;

const TabItem = ({ title, index, active, ...props }) => {
  return (
    <TabItemWrapper active={active} {...props}>
      <Text strong={active}>{title}</Text>
    </TabItemWrapper>
  );
};

TabItem.defaultProps = {
  __TYPE: 'Tab.Item',
};

TabItem.propTypes = {
  __TYPE: PropTypes.oneOf(['Tab.Item']),
};

export default TabItem;
