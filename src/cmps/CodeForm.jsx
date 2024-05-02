import { useState } from 'react'

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
      <input
        type='number'
        value={code.num}
        onChange={(ev) => setCode({ ...code, num: ev.target.value })}
        placeholder='קוד כניסה'
        min={0}
        required
      />
      <button>הוסף קוד כניסה</button>
    </form>
  )
}

export default CodeForm
