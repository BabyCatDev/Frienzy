const initialState = {
  accessToken: null,
  refreshToken: null,
  tokenExpiration: null,
  spotifyTopTracks: [],
  spotifyUserPlaylists: [],
};

const spotifyReducer = (state = initialState, action) => {
  switch(action.type) {
    case "SpotifyAuthChange":
      return {
        ...state,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
        tokenExpiration: action.expiration
      }
    case "SpotifyTopTracks":
      return {
        ...state,
        spotifyTopTracks: action.tracks
      }
    case "SpotifyUserPlaylists":
      return {
        ...state,
        spotifyUserPlaylists: action.playlists
      }
    default:
      return state;
  }
}

export default spotifyReducer;
