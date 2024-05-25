export default function ShiftsTable({ selectedMonth, removeShift }) {
  const calcTotal = (shifts, field) => {
    return shifts.reduce((total, shift) => total + shift[field], 0)
  }

  const calcReadPercentage = (shifts) => {
    const totalRead = calcTotal(shifts, 'read')
    const totalUnread = calcTotal(shifts, 'unread')
    const total = totalRead + totalUnread
    return ((totalRead / total) * 100).toFixed(2)
  }

  const calaDailyRead = (shift) => {
    const { read, unread } = shift
    return ((read / (read + unread)) * 100).toFixed(2)
  }

  return (
    <table>
      <thead>
        <tr>
          <th>מחק</th>
          <th>תאריך</th>
          <th>נקראו</th>
          <th>אי קריאה</th>
          <th>אחוז נקראו</th>
        </tr>
      </thead>
      <tbody>
        {selectedMonth.shifts.map((shift, index) => (
          <tr key={index}>
            <td onClick={() => removeShift(shift.date)}>❌</td>
            <td>{shift.date.split('-').reverse().join('/')}</td>
            <td>{shift.read}</td>
            <td>{shift.unread}</td>
            <td>{calaDailyRead(shift)}%</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th></th>
          <th>סה''כ</th>
          <th>{calcTotal(selectedMonth.shifts, 'read')}</th>
          <th>{calcTotal(selectedMonth.shifts, 'unread')}</th>
          <th>{calcReadPercentage(selectedMonth.shifts)}%</th>
        </tr>
      </tfoot>
    </table>
  )
}
