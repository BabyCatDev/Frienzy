const initialState = {
  userDetails: {},
  conversations: [],
  isEnabled: true,
  location: {},
  groupLocations: [],
  allUsers: [],
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GetUserDetails':
      return {
        ...state,
        userDetails: action.payload,
        dataLoading: false,
      };
    case 'SetConversations':
      return {
        ...state,
        conversations: action.data,
      };
    case 'SetUserLocationEnabled':
      return {
        ...state,
        isEnabled: action.isEnabled,
      };
    case 'SetUserLocation':
      return {
        ...state,
        location: action.location,
      };
    case 'SetGroupLocation':
      return {
        ...state,
        groupLocations: action.groupLocations,
      };
    case 'GetAllUsers':
      return {
        ...state,
        allUsers: action.payload,
        dataLoading: false,
      };
    default:
      return state;
  }
};

export default dataReducer;
