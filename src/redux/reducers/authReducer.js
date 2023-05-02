const initialState = {
  currentUserUID: null,
  messageSent: false,
  loaded: true,
  userDetails: null,
  userFriends: null,
  userInvites: null
};

const authReducer = (state = initialState, action) => {
  switch(action.type) {
    case "Login":
      return {
        ...state,
        currentUserUID: action.payload
      };
    case "SendMessage":
      return {
        ...state,
        messageSent: true,
      };
    case "SignInUp":
      return {
        ...state,
        currentUserUID: action.payload
      };
    case "SignOut":
      return {
        ...state,
        currentUserUID: action.payload
      };
    case "Delete":
      return {
        ...state,
        currentUserUID: action.payload
      };
    case 'UserStateChange':
      return {
          ...state,
          userDetails: action.userData,
          loaded: action.loaded
      };
    case 'UserFriendsChange':
      return {
          ...state,
          userFriends: action.friendsData,
      };
    case 'UserInvitesChange':
      return {
          ...state,
          userInvites: action.invitesData,
      };
    default:
      return state;
  }
}

export default authReducer;
