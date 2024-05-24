import { useEffect, useState, useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { meterService } from '../services/meter.service'
import { loggedInUserContext } from '../services/context'

import MeterPrompt from '../cmps/MeterPrompt.jsx'
import CodeForm from '../cmps/CodeForm.jsx'
import CodeList from '../cmps/CodeList.jsx'

function Main() {
  const navigate = useNavigate()

  const [loggedInUser, setLoggedInUser] = useContext(loggedInUserContext)
  const [num, setNum] = useState(0)
  const [isSearch, setIsSearch] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [text, setText] = useState('')
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [accuracy, setaccuracy] = useState(0)
  const [meter, setMeter] = useState({})
  const [watchId, setWatchId] = useState(null)
  const [message, setMessage] = useState('')
  const [codes, setCodes] = useState([])
  const [mode, setMode] = useState('addMeter')
  const dialog = useRef('dialog')
  const loader = useRef('loader')

  useEffect(() => {
    if (!loggedInUser) return navigate('/')
    followUserLocation()
  }, [isSearch])

  const followUserLocation = () => {
    if (!isSearch && watchId === null) {
      const id = navigator.geolocation.watchPosition(
        (position) => {
          setLatitude(position.coords.latitude)
          setLongitude(position.coords.longitude)
          setaccuracy(Math.floor(position.coords.accuracy))
        },
        (error) => {
          console.error('Error getting location:', error)
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
        }
      )
      setWatchId(id)
    } else if (isSearch && watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    isSearch ? searchMeter() : saveMeter()
  }

  const showMessage = (message, type) => {
    setMessage(message)
    dialog.current.className = type
    dialog.current.showModal()
    setTimeout(() => {
      closeMessage()
    }, 2500)
  }

  const closeMessage = () => {
    dialog.current.close()
    setMessage('')
  }

  const closePrompt = () => {
    setShowPrompt(false)
  }

  const gpsData = () => latitude && longitude && accuracy <= 50

  const addCode = async (code) => {
    if (code.num.length <= 2) return showMessage('הקוד אינו תקין', 'error')
    if (!gpsData) return showMessage('אין קליטת gps', 'error')
    loaderOn()
    const location = { type: 'Point', coordinates: [latitude, longitude] }
    const newCode = { ...code, location }

    try {
      const success = await meterService.addCode(newCode)
      loader.current.close()
      if (success) showMessage('הקוד נשמר בהצלחה', 'success')
      else showMessage('הכתובת כבר קיימת במערכת', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const searchCodes = async () => {
    loaderOn()
    setIsSearch(false)
    setMode('searchCodes')
    try {
      const codes = await meterService.getCodes(latitude, longitude)
      loader.current.close()
      if (codes.length) setCodes(codes)
      else showMessage('לא נמצאו קודים במיקומך', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const saveMeter = async () => {
    if (!gpsData) return showMessage('אין קליטת gps', 'error')
    if (num <= 4) return showMessage('מספר מונה אינו תקין', 'error')
    loaderOn()
    try {
      const success = await meterService.addMeter({
        num,
        text,
        latitude,
        longitude,
      })

      loader.current.close()
      if (success) {
        showMessage('המונה נשמר בהצלחה', 'success')
        setText('')
        setNum(0)
      } else showMessage('המונה כבר קיים במערכת', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const searchMeter = async () => {
    console.log(num)
    if (num <= 4) return showMessage('מספר מונה אינו תקין', 'error')
    loaderOn()
    try {
      const meter = await meterService.getMeter(num)
      loader.current.close()
      if (meter) {
        setMeter(meter)
        setShowPrompt(true)
        setNum(0)
      } else showMessage('לא נמצא מונה', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const setMeterForm = (boolean) => {
    setMode('meterForm')
    setIsSearch(boolean)
  }

  const gotoMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    window.open(url, '_blank')
  }

  const updateCodesState = (codeId, updatedNum) => {
    const newCodes = codes.map((code) => {
      if (code._id === codeId) code.num = updatedNum
      return code
    })
    setCodes(newCodes)
  }

  const loaderOn = () => {
    loader.current.showModal()
  }

  const loaderOff = () => {
    loader.current.close()
  }

  return (
    <main>
      <div>{loggedInUser?.name}</div>
      <div className='curr-locattion'>
        <h1>מיקום נוכחי</h1>
        {latitude}, {longitude}
      </div>
      <div>דיוק מיקום: {accuracy} מטר</div>
      <nav>
        <div className='nav-row'>
          <button
            className={mode === 'meterForm' && isSearch ? 'active' : ''}
            onClick={() => setMeterForm(true)}
          >
            חיפוש מונה
          </button>
          <button
            className={mode === 'meterForm' && !isSearch ? 'active' : ''}
            onClick={() => setMeterForm(false)}
          >
            הוספת מונה
          </button>
        </div>
        <div className='nav-row'>
          <button
            className={mode === 'searchCodes' ? 'active' : ''}
            onClick={searchCodes}
          >
            חפש קוד כניסה
          </button>
          <button
            className={mode === 'addCode' ? 'active' : ''}
            onClick={() => setMode('addCode')}
          >
            הוסף קוד כניסה
          </button>
        </div>
      </nav>

      {mode === 'meterForm' && (
        <form onSubmit={handleSubmit}>
          <h1>מספר מונה מלא</h1>
          <input
            type='number'
            min={0}
            onChange={(ev) => setNum(ev.target.value.trim().replace(/^0+/, ''))}
          />
          {!isSearch && (
            <>
              <h1>תאור מיקום</h1>
              <textarea
                rows={5}
                onChange={(ev) => setText(ev.target.value)}
                placeholder='הכנס תאור (לא חובה)'
              />
            </>
          )}
          <button type='submit'>{!isSearch ? 'שמור מיקום' : 'חפש מונה'}</button>
        </form>
      )}

      {showPrompt && isSearch && mode === 'meterForm' && (
        <MeterPrompt
          meter={meter}
          closePrompt={closePrompt}
          navigate={gotoMap}
        />
      )}

      {mode === 'addCode' && <CodeForm addCode={addCode} />}

      {mode === 'searchCodes' && codes.length > 0 && (
        <CodeList
          codes={codes}
          updateCodesState={updateCodesState}
          loaderOff={loaderOff}
          loaderOn={loaderOn}
        />
      )}

      <dialog ref={dialog}>{message}</dialog>
      <dialog ref={loader} className='loader'></dialog>
    </main>
  )
}

export default Main
