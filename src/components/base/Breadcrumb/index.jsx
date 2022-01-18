import React from 'react';
import styled from '@emotion/styled';
import BreadcrumbItem from './BreadcrumbItem';

const BreadcrumbContainer = styled.nav`
  display: inline-block;
`;

const Breadcrumb = ({ children }) => {
  const items = React.Children.toArray(children)
    .filter((element) => {
      if (React.isValidElement(element) && element.props.__TYPE === 'Breadcrumb.Item') {
        return true;
      }

      console.warn("Only accepts Breadcrumb.Item as it's children.");
      return false;
    })
    .map((element, index, elements) => {
      return React.cloneElement(element, {
        ...element.props,
        active: index === elements.length - 1,
      });
    });

  return <BreadcrumbContainer>{items}</BreadcrumbContainer>;
};

Breadcrumb.Item = BreadcrumbItem;

export default Breadcrumb;
