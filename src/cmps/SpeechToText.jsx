import { useState } from 'react'

function SpeechToText({ emitText }) {
  const [isListening, setIsListening] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = new SpeechRecognition()

  recognition.continuous = false // Set to false for single recognition
  recognition.interimResults = false // Set to true for interim results
  recognition.lang = 'he-IL'

  const handleListen = async () => {
    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }

    recognition.onresult = (ev) => {
      const speechToText = Array.from(ev.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('')
        .replace(/\./g, '')

      emitText(speechToText)
      setShowLoader(false)
    }

    recognition.onspeechend = () => {
      setShowLoader(true)
      recognition.stop()
      setIsListening(false)
      console.log('ההאזנה הופסקה.')
    }

    recognition.onerror = (event) => {
      console.error('שגיאה בזיהוי:', event.error)
      setIsListening(false)
    }
  }

  return (
    <button type='button' onClick={handleListen} className='mic-btn'>
      {showLoader && <div className='loader small'></div>}
      {!isListening && !showLoader && (
        <img src='/icons/microphone.svg' alt='' />
      )}
      {isListening && <div>מאזין...</div>}
    </button>
  )
}

export default SpeechToText
