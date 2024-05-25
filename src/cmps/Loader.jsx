import { useEffect, useRef } from 'react'

export default function loader() {
  const loader = useRef('loader')

  useEffect(() => {
    loader.current.showModal()
  }, [])

  return <dialog ref={loader} className='loader'></dialog>
}
