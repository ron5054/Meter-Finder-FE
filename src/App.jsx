import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [num, setNum] = useState(0)
  const [isSearch, setIsSearch] = useState(false)
  const [text , setText] = useState('')
  const [meters, setMeters] = useState([])

  useEffect(() => {
    if (localStorage.getItem('meters')) {
      setMeters(JSON.parse(localStorage.getItem('meters')))
    }
  }, [])

  const handleChange = (ev) => {
    setNum(ev.target.value)
  }

  const handlText = (ev) => {
    setText(ev.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    isSearch ? searchMeter() : saveMeter()
  }

  const saveMeter = () => {
    if (meters.find(meter => meter.num === num)) return alert('קיים מונה עם קוד זהה') 
    getLocation().then(({longitude, latitude}) => {
      const meter = { num, text, latitude, longitude }
      setMeters(meters.concat(meter))
      localStorage.setItem('meters', JSON.stringify(meters.concat(meter)))
    })
  }

  const searchMeter = () => {
    const meterIndex = meters.findIndex(meter => meter.num === num)
    const {latitude, longitude, text} = meters[meterIndex]
    if (text) {
      if (confirm(`${text} \n האם לנווט למונה?`)) navigate(latitude, longitude)
    } else {
      navigate(latitude, longitude)
    }
  }

  const getLocation = async () => {
          return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(resolve, reject)
            } else {
              reject("Geolocation is not supported by this browser.")
            }
          })
            .then(position => position.coords)
            .catch(err => console.log(err))
  }

  const navigate = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    window.open(url, '_blank')
  }

  return (
    <>
      <button onClick={() => setIsSearch(!isSearch)}>{isSearch ? 'הוספת מונה' : 'חיפוש מונה'}</button>
      <form onSubmit={handleSubmit}>
        <h1>מספר מונה מלא</h1>
        <input type="number" min={0} onChange={handleChange} />
        {!isSearch &&
        <div>
          <h1>תאור מיקום</h1>
          <input type="text" onChange={handlText} placeholder='הכנס תאור (לא חובה)' />
        </div>}
        <button type="submit">{!isSearch ? 'שמור מיקום' : 'חפש מונה'}</button>
      </form>
    </>
  )
}

export default App
