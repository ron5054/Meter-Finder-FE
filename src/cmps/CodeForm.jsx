import { useState } from 'react'
import SpeechToText from '../cmps/SpeechToText.jsx'

function CodeForm({ addCode }) {
  const [code, setCode] = useState({ address: '', num: '' })

  function submitForm(ev) {
    ev.preventDefault()
    addCode(code)
    setCode({ address: '', num: '' })
  }

  return (
    <form onSubmit={submitForm}>
      <input
        type='text'
        value={code.address}
        onChange={(ev) => setCode({ ...code, address: ev.target.value })}
        placeholder='כתובת מלאה'
        required
      />
      <SpeechToText emitText={(text) => setCode({ ...code, address: text })} />
      <input
        type='text'
        value={code.num}
        onChange={(ev) => setCode({ ...code, num: ev.target.value })}
        placeholder='קוד כניסה'
        min={0}
        required
      />
      <button type='submit'>הוסף קוד כניסה</button>
    </form>
  )
}

export default CodeForm
