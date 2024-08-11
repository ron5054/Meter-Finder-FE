import { codeService } from '../services/code.service'
import { useState } from 'react'

function CodeList({ codes, updateCodesState, loaderOn, loaderOff }) {
  const [editCodeId, setEditCodeId] = useState(null)
  const [updatedNum, setUpdatedNum] = useState('')

  const updateCode = async (codeId) => {
    if (updatedNum.length < 3) return
    try {
      loaderOn()
      const { success } = await codeService.updateCode({ codeId, updatedNum })
      loaderOff()

      if (success) {
        updateCodesState(codeId, updatedNum)
        setUpdatedNum('')
        setEditCodeId(null)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ul>
      {codes.map((code) => (
        <li
          key={code._id}
          style={{
            flexDirection: editCodeId ? 'column' : 'row',
            display: editCodeId === code._id || !editCodeId ? 'flex' : 'none',
          }}
        >
          <div>
            {code.address} - {code.num}
          </div>
          {editCodeId === code._id ? (
            <div className='edit-code'>
              <input
                type='text'
                placeholder='הזן קוד מעודכן'
                onChange={(ev) => setUpdatedNum(ev.target.value)}
              />
              <button onClick={() => updateCode(code._id)}>שמור</button>
              <button onClick={() => setEditCodeId(null)}>ביטול</button>
            </div>
          ) : (
            <button onClick={() => setEditCodeId(code._id)}>עדכן קוד</button>
          )}
        </li>
      ))}
    </ul>
  )
}

export default CodeList
