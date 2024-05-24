function MeterList({ meters, openPrompt }) {
  const handleMeterClick = (meter) => {
    openPrompt(meter)
  }

  return (
    <ul className='meters-list'>
      {meters.map((meter) => (
        <li key={meter._id}>
          <button onClick={() => handleMeterClick(meter)}>{meter.num}</button>
        </li>
      ))}
    </ul>
  )
}

export default MeterList
