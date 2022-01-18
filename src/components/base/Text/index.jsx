import PropTypes from 'prop-types';
import './Text.css';

const Text = ({
  children,
  block,
  paragraph,
  size,
  strong,
  underline,
  delete: del,
  color,
  mark,
  code,
  ...props
}) => {
  const getParagraph = (paragraph) => (paragraph ? 'p' : 'span');
  const Tag = block ? 'div' : getParagraph(paragraph);
  const fontStyle = {
    fontWeight: strong ? 'bold' : undefined,
    fontSize: typeof size === 'number' ? size : undefined,
    textDecoration: underline ? 'underline' : undefined,
    color,
  };

  let markup = children;
  if (mark) {
    markup = <mark>{children}</mark>;
  }
  if (code) {
    markup = <code>{children}</code>;
  }
  if (del) {
    markup = <del>{children}</del>;
  }

  return (
    <Tag
      className={typeof size === 'string' ? `Text--size-${size}` : undefined}
      style={{ ...props.style, ...fontStyle }}
      {...props}
    >
      {markup}
    </Tag>
  );
};

Text.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  block: PropTypes.bool,
  paragraph: PropTypes.bool,
  delete: PropTypes.bool,
  code: PropTypes.bool,
  mark: PropTypes.bool,
  strong: PropTypes.bool,
  color: PropTypes.string,
};

export default Text;
