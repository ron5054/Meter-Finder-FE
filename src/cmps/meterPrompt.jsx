function MeterPrompt({ meter, closePrompt, navigate }) {
  const { location, text, num } = meter

  return (
    <div className='meter-prompt'>
      <div>
        מונה {num} - {text || 'נמצא מונה'}
      </div>
      <button
        onClick={() =>
          navigate(location.coordinates[0], location.coordinates[1])
        }
      >
        נווט למונה
      </button>
      <button onClick={closePrompt}>סגור</button>
    </div>
  )
}

export default MeterPrompt
