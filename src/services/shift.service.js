export const shiftService = {
  addShift,
  getShifts,
  removeShift,
  updateMonth
}

const BASE_URL =
  process.env.NODE_ENV === 'production' ? '/' : '//localhost:3030/'

async function addShift(shift) {
  try {
    const response = await fetch(BASE_URL + 'shift/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(shift),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}

async function getShifts() {
  try {
    const response = await fetch(BASE_URL + 'shift', {
      credentials: 'include',
    })

    if (response.status === 404) return null

    const shifts = await response.json()
    return shifts
  } catch (error) {
    console.log(error)
  }
}

async function removeShift(shiftDate) {
  try {
    const response = await fetch(`${BASE_URL}shift/remove/${shiftDate}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
}

async function updateMonth(month) {
  try {
    const response = await fetch(BASE_URL + 'shift/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(month),
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.log(error)
  }
} 
