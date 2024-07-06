import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { meterService } from '../services/meter.service'
import { userService } from '../services/user.service.js'
import { codeService } from '../services/code.service.js'
import { loggedInUserContext } from '../services/context'

import MeterPrompt from '../cmps/MeterPrompt.jsx'
import CodeForm from '../cmps/CodeForm.jsx'
import CodeList from '../cmps/CodeList.jsx'
import MeterList from '../cmps/MeterList.jsx'
import Loader from '../cmps/Loader.jsx'
import MessageDialog from '../cmps/MessageDialog.jsx'
import SpeechToText from '../cmps/SpeechToText.jsx'

function Main() {
  const navigate = useNavigate()

  const [loggedInUser, setLoggedInUser] = useContext(loggedInUserContext)
  const [num, setNum] = useState('')
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
  const [metersAround, setMetersAround] = useState([])
  const [mode, setMode] = useState('addMeter')
  const [radius, setRadius] = useState(1000)
  const [showLoader, setShowLoader] = useState(false)
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (!loggedInUser) return navigate('/')
    followUserLocation()
    codeService.saveCodesFromStorage()
    updateUserLastSeen()
  }, [isSearch])

  const updateUserLastSeen = async () => {
    if (Date.now() - loggedInUser.lastSeen?.timestamp < 300000) return
    try {
      const updatedUser = await userService.setLastLogin(loggedInUser)
      if (updatedUser) setLoggedInUser(updatedUser)
    } catch (error) {
      console.error(error)
    }
  }

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

  const showMessage = (text, type) => {
    setMessage({ type, text })
  }

  const closePrompt = () => {
    setShowPrompt(false)
  }

  const gpsData =
    (process.env.NODE_ENV === 'development'
      ? accuracy <= 100000
      : accuracy <= 50) &&
    latitude &&
    longitude

  const addCode = async (code) => {
    if (code.num.length <= 2) return showMessage('הקוד אינו תקין', 'error')
    if (!gpsData) return showMessage('אין קליטת gps', 'error')
    setShowLoader(true)
    const location = { type: 'Point', coordinates: [latitude, longitude] }
    const newCode = { ...code, location }

    try {
      const success = await codeService.addCode(newCode)
      setShowLoader(false)
      if (success) showMessage('הקוד נשמר בהצלחה', 'success')
      else
        success === null
          ? showMessage('הכתובת כבר קיימת במערכת', 'error')
          : showMessage('תקלת תקשורת, הקוד ישלח לשמירה בהמשך', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const searchCodes = async () => {
    if (!gpsData) return showMessage('אין קליטת gps', 'error')
    setShowLoader(true)
    setIsSearch(false)
    setMode('searchCodes')
    try {
      const codes = await codeService.getCodes(latitude, longitude)
      setShowLoader(false)
      if (codes.length) setCodes(codes)
      else showMessage('לא נמצאו קודים במיקומך', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const saveMeter = async () => {
    if (!gpsData) return showMessage('אין קליטת gps', 'error')
    if (num <= 4) return showMessage('מספר מונה אינו תקין', 'error')
    setShowLoader(true)
    try {
      const success = await meterService.addMeter({
        num,
        text,
        location: { type: 'Point', coordinates: [latitude, longitude] },
      })

      setShowLoader(false)
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
    if (num.length <= 4) return showMessage('הזן לפחות 5 ספרות', 'error')
    setShowLoader(true)
    try {
      const meter = await meterService.getMeter(num)
      setShowLoader(false)
      if (meter) {
        setMeter(meter)
        setShowPrompt(true)
      } else showMessage('לא נמצא מונה', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const setMeterForm = (boolean) => {
    setShowPrompt(false)
    setMode('meterForm')
    setIsSearch(boolean)
  }

  const gotoMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    window.open(url, '_blank')
  }

  const searchMetersAround = async () => {
    if (!gpsData) return showMessage('אין קליטת gps', 'error')
    setMode('searchMetersAround')
    setShowPrompt(false)
    try {
      setShowLoader(true)
      const meters = await meterService.getMetersBylocation(
        latitude,
        longitude,
        radius
      )
      setShowLoader(false)

      if (meters) setMetersAround(meters)
      else
        meters === null
          ? showMessage('לא נמצאו מונים סביבך', 'error')
          : showMessage('מצטערים, נסה לשפר קליטה', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const updateCodesState = (codeId, updatedNum) => {
    const newCodes = codes.map((code) => {
      if (code._id === codeId) code.num = updatedNum
      return code
    })
    setCodes(newCodes)
  }

  const openPrompt = (meter) => {
    setIsSearch(true)
    setMeter(meter)
    setShowPrompt(true)
  }

  const goToShifts = () => {
    navigate('/shifts')
  }

  const handleText = (text) => {
    const num = parseInt(text)
    if (!isNaN(num)) setNum(num)
    else showMessage('לא נקלט מספר', 'error')
  }

  const searchCodesByAddress = async () => {
    if (!address) return showMessage('לא הכנסת כתובת', 'error')
    setShowLoader(true)
    try {
      const codes = await codeService.getCodesByAddress(address)
      setShowLoader(false)
      if (codes.length) setCodes(codes)
      else showMessage('לא נמצאו קודים בכתובת', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main>
      <header>
        <div>{loggedInUser?.name}</div>
        <button onClick={goToShifts}>מעקב משמרות</button>
      </header>

      <div className='curr-locattion'>
        <h1>מיקום נוכחי</h1>
        {latitude}, {longitude}
      </div>
      <div>דיוק מיקום: {accuracy} מטר</div>
      <nav>
        <button className='search-meters-btn' onClick={searchMetersAround}>
          חפש מונים בסביבתי
          <input
            type='range'
            min={100}
            max={1000}
            step={100}
            value={radius}
            onInput={(e) => setRadius(e.target.value)}
          />
          <span>{radius} מטר</span>
        </button>
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
          <input
            value={num}
            type='number'
            min={0}
            onChange={(ev) => setNum(ev.target.value.trim().replace(/^0+/, ''))}
            placeholder='מספר מונה'
          />
          <SpeechToText emitText={handleText} />
          {!isSearch && (
            <textarea
              rows={5}
              onChange={(ev) => setText(ev.target.value)}
              placeholder='הכנס תאור מיקום (לא חובה)'
            />
          )}
          <button type='submit'>{!isSearch ? 'שמור מיקום' : 'חפש מונה'}</button>
        </form>
      )}

      {showPrompt && isSearch && (
        <MeterPrompt
          meter={meter}
          closePrompt={closePrompt}
          navigate={gotoMap}
        />
      )}

      {mode === 'addCode' && <CodeForm addCode={addCode} />}

      {mode === 'searchCodes' && (
        <>
          <input
            type='text'
            placeholder='הכנס כתובת'
            onChange={(ev) => setAddress(ev.target.value)}
          />
          <button onClick={searchCodesByAddress}>
            חפש קוד כניסה לפי כתובת
          </button>
          <CodeList
            codes={codes}
            updateCodesState={updateCodesState}
            loaderOff={() => setShowLoader(false)}
            loaderOn={() => setShowLoader(true)}
          />
        </>
      )}

      {mode === 'searchMetersAround' && metersAround.length > 0 && (
        <MeterList meters={metersAround} openPrompt={openPrompt} />
      )}

      {showLoader && <Loader />}
      <MessageDialog message={message} />
      <div className='version'>ver {import.meta.env.VITE_APP_VERSION}</div>
    </main>
  )
}

export default Main
