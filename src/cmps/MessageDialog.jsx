import { useEffect, useRef } from 'react'

export default function MessageDialog({ message }) {
  const { type, text } = message
  const modal = useRef(null)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (message) {
      modal.current?.showModal()

      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      timeoutRef.current = setTimeout(() => {
        modal.current?.close()
      }, 2000)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [message])

  return (
    <dialog ref={modal} className={type}>
      {text}
    </dialog>
  )
}
