function MeterPrompt({ meter, closePrompt, navigate }) {
  const { latitude, longitude, text } = meter
  return (
    <div className='meter-prompt'>
      <div>{text || 'נמצא מונה'} </div>
      <button onClick={() => navigate(latitude, longitude)}>נווט למונה</button>
      <button onClick={closePrompt}>סגור</button>
    </div>
  )
}

export default MeterPrompt
