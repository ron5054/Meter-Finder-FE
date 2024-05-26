import { useEffect, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { meterService } from '../services/meter.service'
import { loggedInUserContext } from '../services/context'
import Loader from '../cmps/Loader'
function LoginPage() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({})
  const [loggedInUser, setLoggedInUser] = useContext(loggedInUserContext)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    const fetchUserAndNavigate = async () => {
      try {
        setShowLoader(true)
        const user = await meterService.getUser()
        if (user) {
          setLoggedInUser(user)
          navigate('/home')
        } else setShowLoginForm(true)
        setShowLoader(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchUserAndNavigate()
  }, [])

  const login = async (ev) => {
    ev.preventDefault()
    try {
      setShowLoader(true)
      const user = await meterService.login(credentials)
      setShowLoader(false)
      if (user) navigate('/home')
      else alert('שם משתמש או סיסמא אינם תקינים', 'error')
    } catch (error) {
      console.log(error)
    }
  }

  const handleLoginForm = (e) => {
    const { name, value } = e.target
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }))
  }

  return (
    <>
      {showLoginForm && (
        <form className='login-form' onSubmit={login}>
          <input
            type='text'
            name='username'
            placeholder='שם משתמש'
            onChange={handleLoginForm}
          />
          <input
            type='password'
            name='password'
            placeholder='סיסמא'
            onChange={handleLoginForm}
          />
          <button type='submit'>התחבר</button>
        </form>
      )}

      {showLoader && <Loader />}
    </>
  )
}

export default LoginPage
