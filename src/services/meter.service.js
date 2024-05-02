export const meterService = {
  addMeter,
  getMeter,
  addCode,
  getCodes,
}

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/' : '//localhost:3030/'

async function addMeter(meter) {
  try {
    const response = await fetch(BASE_URL + 'add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(meter),
    })

    const { success } = await response.json()
    return success
  } catch (error) {
    console.log(error)
  }
}

async function getMeter(number) {
  try {
    const response = await fetch(BASE_URL + 'meter/' + number)
    const meter = await response.json()
    return meter
  } catch (error) {
    console.log(error)
  }
}

async function addCode(code) {
  try {
    const response = await fetch(BASE_URL + 'addCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
      `${BASE_URL}codes?latitude=${latitude}&longitude=${longitude}`
    )
    const { codes } = await response.json()
    return codes
  } catch (error) {
    console.log(error)
  }
}
