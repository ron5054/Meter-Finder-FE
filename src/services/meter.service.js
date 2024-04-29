export const meterService = {
  addMeter,
  getMeter,
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
