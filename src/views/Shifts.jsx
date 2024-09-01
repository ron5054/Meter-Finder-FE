import { useState, useEffect, useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { loggedInUserContext } from '../services/context'
import { shiftService } from '../services/shift.service'
import AddshiftForm from '../cmps/AddShiftForm.jsx'
import ShiftsTable from '../cmps/ShiftsTable.jsx'
import Loader from '../cmps/Loader.jsx'
import MessageDialog from '../cmps/MessageDialog.jsx'

export default function Shifts() {
  const confirmModal = useRef('loader')
  const editModal = useRef('editModal')
  const navigate = useNavigate()
  const [mode, setMode] = useState('')
  const [months, setMonths] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const [loggedInUser] = useContext(loggedInUserContext)
  const [message, setMessage] = useState('')
  const [shiftDate, setshiftDate] = useState('')
  const [selectedShift, setSelectedShift] = useState({
    date: '',
    read: '',
    unread: '',
    km: '',
  })

  useEffect(() => {
    if (!loggedInUser) return navigate('/home')
  }, [loggedInUser])

  const addShift = async (shift) => {
    try {
      setShowLoader(true)
      const { success } = await shiftService.addShift(shift)
      if (success) {
        setMessage({
          type: 'success',
          text: 'המשמרת נוספה בהצלחה',
        })

        const month = parseInt(shift.date.split('-')[1], 10)
        const monthToUpdate = months.find((m) => m.month === month)

        const updatedShifts = [...(monthToUpdate?.shifts || []), shift].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )

        setMonths((prevMonths) =>
          prevMonths.map((month) =>
            month._id === monthToUpdate._id
              ? { ...monthToUpdate, shifts: updatedShifts }
              : month
          )
        )

        setSelectedMonth({
          ...monthToUpdate,
          shifts: updatedShifts,
        })
      }

      setShowLoader(false)
    } catch (error) {
      console.log(error)
      setShowLoader(false)
    }
  }

  const getShifts = async () => {
    try {
      setShowLoader(true)
      const months = await shiftService.getShifts()
      setShowLoader(false)

      setMonths(months)
      setSelectedMonth(months[months.length - 1])
      setMode('showMonths')
    } catch (error) {
      console.log(error)
    }
  }

  const removeShift = async () => {
    try {
      setShowLoader(true)
      const { success } = await shiftService.removeShift(shiftDate)
      setShowLoader(false)

      if (success) {
        const updatedMonth = {
          ...selectedMonth,
          shifts: selectedMonth.shifts.filter(
            (shift) => shift.date !== shiftDate
          ),
        }

        if (updatedMonth.shifts.length) setSelectedMonth(updatedMonth)
        else setSelectedMonth(null)

        setMonths((prevMonths) =>
          prevMonths.map((month) =>
            month._id === updatedMonth._id ? updatedMonth : month
          )
        )
        confirmModal.current.close()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const openEditModal = (shift) => {
    setSelectedShift(shift)
    editModal.current.showModal()
  }

  const editShift = async (shift) => {
    
      const month = parseInt(shift.date.split('-')[1], 10)
      const monthToUpdate = months.find((m) => m.month === month)
      monthToUpdate.shifts = monthToUpdate.shifts.map((s) =>
        s.date === shift.date ? shift : s
      )

      setMonths((prevMonths) =>
        prevMonths.map((month) =>
          month._id === monthToUpdate._id
            ? { ...monthToUpdate, shifts: monthToUpdate.shifts }
            : month
        )
      )

      setSelectedMonth({ ...monthToUpdate, shifts: monthToUpdate.shifts })

      try {
        setShowLoader(true)
        const { success } = await shiftService.updateMonth(monthToUpdate)
        setShowLoader(false)
        if (success) editModal.current.close()
      } catch (error) {
        console.log(error)
      }
  }
    

  const openConfirmModal = (shiftDate) => {
    setshiftDate(shiftDate)
    confirmModal.current.showModal()
  }

  const euDate = (date) => {
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <>
      <div className='nav-row nav-shifts'>
        <button onClick={() => setMode('addShift')}>הוסף משמרת</button>
        <button onClick={() => getShifts()}>הצג משמרות</button>
        <button onClick={() => navigate('/home')}>חזרה לדף הבית</button>
      </div>

      {mode === 'addShift' && (
        <AddshiftForm addShift={addShift} closeForm={() => setMode('')} />
      )}

      {mode === 'showMonths' && (
        <ul className='month-list'>
          {months.map(
            (month) =>
              month?.shifts.length > 0 && (
                <button
                  key={month._id}
                  onClick={() => setSelectedMonth(month)}
                  className={month?._id === selectedMonth?._id ? 'active' : ''}
                >
                  {month.month}/{month.year}
                </button>
              )
          )}
        </ul>
      )}

      {selectedMonth && mode === 'showMonths' && (
        <ShiftsTable
          selectedMonth={selectedMonth}
          removeShift={openConfirmModal}
          editShift={openEditModal}
        />
      )}

      {showLoader && <Loader />}
      <MessageDialog message={message} />

      <dialog ref={confirmModal}>
        <p>
          האם אתה בטוח שברצונך למחוק את המשמרת?{' '}
          {shiftDate.split('-').reverse().join('/')}
        </p>
        <div className='confirm-btns'>
          <button onClick={() => confirmModal.current.close()}>בטל</button>
          <button onClick={removeShift}>מחק</button>
        </div>
      </dialog>

      <dialog ref={editModal} className="edit-modal-container">
        <section className="edit-modal">
          <div>{euDate(selectedShift?.date)}</div>
          <input type="text" placeholder="מספר מונים" value={selectedShift?.read|| ''} onChange={(e) => setSelectedShift({ ...selectedShift, read: +e.target.value })} />
          <input type="text" placeholder="אי קריאה" value={selectedShift?.unread|| ''} onChange={(e) => setSelectedShift({ ...selectedShift, unread: +e.target.value })} />
          <input type="text" placeholder="קילומטר" value={selectedShift?.km|| ''} onChange={(e) => setSelectedShift({ ...selectedShift, km: e.target.value })} />
          <section className="edit-shift-btns">
            <button onClick={() => editModal.current.close()}>סגור</button>
            <button onClick={() => editShift(selectedShift)}>שמור</button>
          </section>
        </section>
      </dialog>
    </>
  )
}