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
  const navigate = useNavigate()
  const [mode, setMode] = useState('')
  const [months, setMonths] = useState([])
  const [selectedMonth, setSelectedMonth] = useState('')
  const [showLoader, setShowLoader] = useState(false)
  const [loggedInUser, setLoggedInUser] = useContext(loggedInUserContext)
  const [message, setMessage] = useState('')
  const [shiftDate, setshiftDate] = useState('')

  useEffect(() => {
    if (!loggedInUser) return navigate('/home')
  }, [loggedInUser])

  const addShift = async (shift) => {
    try {
      setShowLoader(true)
      const { success } = await shiftService.addShift(shift)
      setShowLoader(false)
      if (success) {
        setMessage({
          type: 'success',
          text: 'המשמרת נוספה בהצלחה',
        })

        if (selectedMonth)
          setSelectedMonth((prevMonth) => ({
            ...prevMonth,
            shifts: [...prevMonth?.shifts, shift],
          }))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getShifts = async () => {
    try {
      setShowLoader(true)
      const months = await shiftService.getShifts()
      setShowLoader(false)

      setMonths(
        months.map((month) => ({
          ...month,
          shifts: month.shifts.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          ),
        }))
      )
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

        setSelectedMonth(updatedMonth)

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

  const openConfirmModal = (shiftDate) => {
    setshiftDate(shiftDate)
    confirmModal.current.showModal()
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
              month.shifts.length > 0 && (
                <button
                  key={month._id}
                  onClick={() => setSelectedMonth(month)}
                  className={month._id === selectedMonth._id ? 'active' : ''}
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
    </>
  )
}
