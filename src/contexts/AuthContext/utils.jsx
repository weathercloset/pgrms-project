export const getLikesMap = (likes = []) =>
  likes.reduce((map, like) => ({ ...map, [like.post]: true }), {});
