import styled from '@emotion/styled';
import React, { useMemo, useState } from 'react';
import TabItem from './TabItem';

const childrenToArray = (children, types) => {
  return React.Children.toArray(children).filter((element) => {
    if (React.isValidElement(element) && types.includes(element.props.__TYPE)) {
      return true;
    }

    console.warn(
      `Only accepts ${Array.isArray(types) ? types.join(', ') : types} as it's children.`,
    );
    return false;
  });
};

const TabItemContainer = styled.div`
  margin-top: 10px;
  background-color: #eee;
`;

const Tab = ({ children, active, reverse = false }) => {
  const [currentActive, setCurrentActive] = useState(() => {
    if (active) {
      return active;
    }
    const { index } = childrenToArray(children, 'Tab.Item')[0].props;
    return index;
  });

  const items = useMemo(() => {
    return childrenToArray(children, 'Tab.Item').map((element) => {
      return React.cloneElement(element, {
        ...element.props,
        key: element.props.index,
        active: element.props.index === currentActive,
        onClick: () => {
          setCurrentActive(element.props.index);
        },
      });
    });
  }, [children, currentActive]);

  const activeItem = useMemo(
    () => items.find((element) => currentActive === element.props.index),

    [currentActive, items],
  );

  return (
    <>
      {reverse ? (
        <div>
          <div key={currentActive}>{activeItem.props.children}</div>
          <TabItemContainer style={{ marginTop: 24 }}>{items}</TabItemContainer>
        </div>
      ) : (
        <div>
          <TabItemContainer>{items}</TabItemContainer>
          <div key={currentActive}>{activeItem.props.children}</div>
        </div>
      )}
    </>
  );
};

Tab.Item = TabItem;

export default Tab;
