import { BASE_URL } from '../services/meter.service'

export const userService = {
  setLastLogin,
  getUser,
}

async function setLastLogin(loggedInUser) {
  const date = new Date().toLocaleDateString()
  const time = new Date().toLocaleTimeString()
  const deviceType = _getDeviceType(navigator.userAgent)
  const browser = _getBrowser(navigator.userAgent)

  const user = {
    ...loggedInUser,
    lastSeen: { timestamp: Date.now(), date, time, deviceType, browser },
  }

  return await updateUser(user)
}

function _getDeviceType(userAgent) {
  const deviceTypes = {
    mobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i,
    desktop: /Macintosh|Windows|Linux|CrOS/i,
  }

  for (const [type, regex] of Object.entries(deviceTypes)) {
    if (regex.test(userAgent)) return type
  }
  return 'unknown'
}

function _getBrowser(userAgent) {
  const browserMap = {
    Chrome: /Chrome/i,
    Firefox: /Firefox/i,
    Safari: /Safari/i,
    Edge: /Edge/i,
    Opera: /Opera/i,
    'Internet Explorer': /Trident/i,
  }

  for (const [browser, regex] of Object.entries(browserMap)) {
    if (regex.test(userAgent)) return browser
  }
  return 'unknown'
}

async function updateUser(user) {
  try {
    const response = await fetch(BASE_URL + 'user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(user),
    })

    if (!response.ok) {
      throw new Error(await response.text())
    }

    return await response.json()
  } catch (error) {
    console.error('Error during updateUser:', error)
    return null
  }
}

async function getUser() {
  try {
    const response = await fetch(BASE_URL + 'user', {
      credentials: 'include',
    })

    if (response.status === 401) return null

    const user = await response.json()
    return user
  } catch (error) {
    console.log(error)
  }
}
