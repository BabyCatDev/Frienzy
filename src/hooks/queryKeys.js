export const keys = {
    user: (user) => ['user', user],
    userFriends: (userId, otherUserId) => ['friends', userId + otherUserId],
  }