import { useState } from 'react'

export default function AddShiftForm({ addShift, closeForm }) {
  const [shift, setShift] = useState({
    date: new Date().toISOString().split('T')[0],
    read: 0,
    unread: 0,
    km: '',
  })

  const submitAddShift = (ev) => {
    ev.preventDefault()
    addShift(shift)
  }

  return (
    <form onSubmit={submitAddShift}>
      <div className='flex-jc-sb-ai'>
        <label htmlFor='date'>בחר תאריך</label>
        <input
          value={shift.date}
          type='date'
          id='date'
          onChange={(ev) => setShift({ ...shift, date: ev.target.value })}
          required
        />
      </div>
      <input
        type='number'
        min={0}
        placeholder='מספר מונים שנקראו'
        onChange={(ev) =>
          setShift({ ...shift, read: parseInt(ev.target.value) })
        }
        required
      />
      <input
        type='number'
        min={0}
        placeholder='אי קריאה'
        onChange={(ev) =>
          setShift({ ...shift, unread: parseInt(ev.target.value) })
        }
      />
      <input
        type='number'
        min={0}
        placeholder='ק"מ'
        onChange={(ev) =>
          setShift({ ...shift, km: parseInt(ev.target.value) })
        }
      />
      <button type='submit'>הוסף משמרת</button>
      <button onClick={closeForm}>סגור</button>
    </form>
  )
}
