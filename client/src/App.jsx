import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import API from './API/API.mjs'
import {AuthContext} from "./context/authContext.jsx";
import Navbar from './components/navbar.jsx';
import LandingPage from './components/landingPage.jsx';
import SignIn from './components/signIn.jsx';
import Home from './components/homePage.jsx'
import Match from './components/match.jsx';
import CardSummary from './components/summary.jsx';

function App() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState('');

  const isLoggedIn = async (credentials) => {
    setUser(await API.isLoggedIn(credentials))
    setMessage('');
  }

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <>
      <AuthContext.Provider value={{user: user, setUser: setUser}}>
        <Navbar/>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home/:userId" element={<Home />} />
          <Route path="/match/:userId" element={<Match />} />
          <Route path="/summury/:userId/:matchId" element={<CardSummary/>} />
        </Routes>
      </AuthContext.Provider>    
    </>
  )
}

export default App
