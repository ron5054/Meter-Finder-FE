export const meterService = {
  addMeter,
  getMeter,
  addCode,
  updateCode,
  getCodes,
  login,
  getUser,
  getMetersBylocation,
}

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/' : '//localhost:3030/'

async function addMeter(meter) {
  try {
    const response = await fetch(BASE_URL + 'meter/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meter),
      credentials: 'include',
    })

    const { success } = await response.json()
    return success
  } catch (error) {
    console.log(error)
  }
}

async function getMeter(number) {
  try {
    const response = await fetch(BASE_URL + 'meter/' + number, {
      credentials: 'include',
    })

    if (response.status === 404) return null

    const meter = await response.json()
    return meter
  } catch (error) {
    console.log(error)
  }
}

async function addCode(code) {
  try {
    const response = await fetch(BASE_URL + 'code/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(code),
    })

    const { success } = await response.json()
    return success
  } catch (error) {
    console.log(error)
  }
}

async function getCodes(latitude, longitude) {
  try {
    const response = await fetch(
      `${BASE_URL}code?latitude=${latitude}&longitude=${longitude}`,
      {
        credentials: 'include',
      }
    )

    if (response.status === 404) return null

    const { codes } = await response.json()
    return codes
  } catch (error) {
    console.log(error)
  }
}

async function login(creds) {
  try {
    const response = await fetch(BASE_URL + 'auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(creds),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error)
    }

    const user = await response.json()
    return user
  } catch (error) {
    console.error('Error during login:', error)
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

async function updateCode(updatedCode) {
  try {
    const response = await fetch(BASE_URL + 'code/update/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updatedCode),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}

async function getMetersBylocation(latitude, longitude, radius) {
  try {
    const response = await fetch(
      `${BASE_URL}meter/around?latitude=${latitude}&longitude=${longitude}&radius=${radius}`,
      {
        credentials: 'include',
      }
    )

    if (response.status === 404) return null

    const meters = await response.json()
    return meters
  } catch (error) {
    console.log(error)
  }
}
