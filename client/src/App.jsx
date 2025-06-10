import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import API from './API/API.mjs'
import Navbar from './components/navbar.jsx';
import LandingPage from './components/landingPage.jsx';
import SignIn from './components/signIn.jsx';
import Home from './components/homePage.jsx'
import Match from './components/match.jsx';

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

  const handleStatistic = async() => {
    try{
      await API.getStatistic(user.id)
    }catch(err){
      setMessage({msg: err, type: 'danger'});
    }
  }

  const handleIntialCards = async() => {
    try{
      const cards = await API.getInitialCards()

      return cards
    }catch(err){
      setMessage({msg: err, type: 'danger'});
    }
  }

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
          <Route path="/home" element={<Home loggedIn={loggedIn} user={user} handleStatistic={handleStatistic}/>} />
          <Route path="/match" element={<Match loggedIn={loggedIn} handleIntialCards={handleIntialCards} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
