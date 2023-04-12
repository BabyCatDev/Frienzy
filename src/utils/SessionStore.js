import EncryptedStorage from 'react-native-encrypted-storage'

export const saveAccessToken = async (refreshToken, accessToken, expiresIn) => {
  return EncryptedStorage.setItem(
    'user_session',
    JSON.stringify({
      token: accessToken,
      expires: Date.now() / 1000 + expiresIn,
      refreshToken: refreshToken,
    }),
  )
}

export const getAccessToken = async () => {
  const session = await EncryptedStorage.getItem('user_session')

  if (session !== undefined) {
    let sessionObj = JSON.parse(session)
    if (sessionObj && sessionObj.expires) {
      if (sessionObj.expires > Date.now() / 1000) {
        return sessionObj.token
      }
    }
  }
}

export const getRefreshToken = async () => {
  const session = await EncryptedStorage.getItem('user_session')

  if (session !== undefined) {
    let sessionObj = JSON.parse(session)
    if (sessionObj && sessionObj.refreshToken) {
      return sessionObj.refreshToken
    }
  }
}

export const clearSession = async () => {
  return await EncryptedStorage.removeItem('user_session')
}
