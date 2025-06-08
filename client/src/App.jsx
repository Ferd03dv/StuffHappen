import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import API from './API/API.mjs'
import Navbar from './components/navbar.jsx';
import LandingPage from './components/landingPage.jsx';
import SignIn from './components/signIn.jsx';
import Home from './components/homePage.jsx'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');


  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials)
      setLoggedIn(true);
      setUser(user);
    }catch(err) {
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage('');
  };

  return (
    <>
      <div>
        <Navbar loggedIn={loggedIn} handleLogout={handleLogout} />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn handleLogin={handleLogin} />} />
          <Route path="/home" element={<Home loggedIn={loggedIn} user={user}/>} />
        </Routes>
      </div>
    </>
  )
}

export default App
