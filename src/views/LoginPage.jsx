import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { meterService } from '../services/meter.service'

function LoginPage() {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({})

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser')
    const oneYear = 1000 * 60 * 60 * 24 * 365
    if (loggedInUser) {
      const { user, loginTime } = JSON.parse(loggedInUser)

      const expired = Date.now() - loginTime >= oneYear
      if (expired) localStorage.removeItem('loggedInUser')
      else navigate('/home')
    }
  }, [])

  const login = async (ev) => {
    ev.preventDefault()
    try {
      const user = await meterService.login(credentials)
      if (user) {
        const userData = { user, loginTime: Date.now() }
        localStorage.setItem('loggedInUser', JSON.stringify(userData))
        navigate('/home')
      } else alert('שם משתמש או סיסמא אינם תקינים', 'error')
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
  )
}

export default LoginPage
