import { Header, Toggle } from '../../base';

const PostTag = ({ onChange = () => {} }) => {
  const handleTags = (name, checked) => {
    onChange(name, checked);
  };
  return (
    <div>
      <Header style={{ fontSize: 22, fontWeight: 600, marginTop: 32 }}>오늘의 컨셉</Header>
      <Toggle name="street" onChange={handleTags}>
        street
      </Toggle>
      <Toggle name="casual" onChange={handleTags}>
        casual
      </Toggle>
      <Toggle name="classic" onChange={handleTags}>
        classic
      </Toggle>
      <Toggle name="modern" onChange={handleTags}>
        modern
      </Toggle>
      <Toggle name="dandy" onChange={handleTags}>
        dandy
      </Toggle>
      <Toggle name="sporty" onChange={handleTags}>
        sporty
      </Toggle>
    </div>
  );
};

export default PostTag;
