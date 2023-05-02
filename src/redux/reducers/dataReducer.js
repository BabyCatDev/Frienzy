const initialState = {
  userDetails: {},
  conversations: [],
};

const dataReducer = (state = initialState, action) => {
  switch(action.type) {
    case "GetUserDetails":
      return {
        ...state,
        userDetails: action.payload,
        dataLoading: false,
      };
    case "SetConversations":
      return {
        ...state,
        conversations: action.data
      }
    default:
      return state;
  }
}

export default dataReducer;
