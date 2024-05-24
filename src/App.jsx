import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { loggedInUserContext } from './services/context.js'

import Main from './views/Main.jsx'
import LoginPage from './views/LoginPage.jsx'
const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null)

  return (
    <loggedInUserContext.Provider value={[loggedInUser, setLoggedInUser]}>
      <Router>
        <Routes>
          <Route exact path='/' element={<LoginPage />} />
          <Route path='/home' element={<Main />} />
        </Routes>
      </Router>
    </loggedInUserContext.Provider>
  )
}

export default App
