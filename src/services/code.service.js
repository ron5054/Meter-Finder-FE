import { BASE_URL } from '../services/meter.service'

export const codeService = {
  addCode,
  getCodes,
  getCodesByAddress,
  saveCodesFromStorage,
  updateCode,
}

async function addCode(code) {
  _cacheCode(code)
  try {
    const response = await fetch(BASE_URL + 'code/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(code),
    })

    if (response.status === 409) return null

    const { success } = await response.json()
    if (success) _removeCodeFromCache(code)
    return success
  } catch (error) {
    console.log(error)
  }
}

function _cacheCode(code) {
  const codes = JSON.parse(localStorage.getItem('codes') || '[]')
  localStorage.setItem('codes', JSON.stringify([...codes, code]))
}

function _removeCodeFromCache(code) {
  const codes = JSON.parse(localStorage.getItem('codes') || '[]')
  localStorage.setItem(
    'codes',
    JSON.stringify(codes.filter((c) => c.address !== code.address))
  )
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

async function saveCodesFromStorage() {
  const codes = JSON.parse(localStorage.getItem('codes') || '[]')
  if (!codes.length) return
  const addCodePromises = codes.map((code) => addCode(code))
  try {
    const successes = await Promise.all(addCodePromises)
    if (successes.length === codes.length) localStorage.removeItem('codes')
  } catch (error) {
    console.log(error)
  }
}

async function getCodesByAddress(address) {
  try {
    const response = await fetch(BASE_URL + 'code/' + address, {
      credentials: 'include',
    })

    if (response.status === 404) return null

    const codes = await response.json()
    return codes
  } catch (error) {
    console.log(error)
  }
}
