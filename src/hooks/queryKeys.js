export const keys = {
  user: (user) => ['user', user],
  group: (group) => ['group', group],
  userFriends: (userId, otherUserId) => ['friends', userId + otherUserId],
  friends: (friends) => ['friends', friends.join(',')]
};
