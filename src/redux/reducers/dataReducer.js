const initialState = {
  userDetails: {},
  conversations: [],
  locationIsEnabled: false,
  location: {},
  groupLocations: [],
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
    default:
      return state;
  }
};

export default dataReducer;
