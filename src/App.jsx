import { useEffect, useState, useRef } from 'react'
import { meterService } from './services/meter.service'
import MeterPrompt from './cmps/meterPrompt.jsx'
import './App.css'

function App() {
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
  const dialog = useRef('dialog')

  useEffect(() => {
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
  }, [isSearch])

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

  const saveMeter = async () => {
    if (num.length <= 4) return showMessage('מספר מונה אינו תקין', 'error')
    try {
      const success = await meterService.addMeter({
        num,
        text,
        latitude,
        longitude,
      })

      if (success) showMessage('המונה נשמר בהצלחה', 'success')
      else showMessage('המונה כבר קיים במערכת', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const searchMeter = async () => {
    if (num.length <= 4) return showMessage('מספר מונה אינו תקין', 'error')
    try {
      const meter = await meterService.getMeter(num)
      setMeter(meter)
      if (meter) setShowPrompt(true)
      else showMessage('לא נמצא מונה', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const navigate = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    window.open(url, '_blank')
  }

  return (
    <>
      <div className='curr-locattion'>
        <h1>מיקום נוכחי</h1>
        {latitude}, {longitude}
      </div>
      <div>דיוק מיקום: {accuracy} מטר</div>
      <button onClick={() => setIsSearch(!isSearch)}>
        {isSearch ? 'הוספת מונה' : 'חיפוש מונה'}
      </button>
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

      {showPrompt && isSearch && (
        <MeterPrompt
          meter={meter}
          closePrompt={closePrompt}
          navigate={navigate}
        />
      )}

      <dialog ref={dialog}>{message}</dialog>
    </>
  )
}

export default App
