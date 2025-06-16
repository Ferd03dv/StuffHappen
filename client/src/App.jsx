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
  const [matchId, setMatchId] = useState('');


  const isLoggedIn = async (credentials) => {
    setUser(await API.isLoggedIn(credentials))
    setMessage('');
  }

  useEffect(() => {
    isLoggedIn();
  }, []);

  const handleInitialMatchAndCards = async (demo) => {
    try {
      if(!demo){
        const { id } = await API.createMatch(user.id);
        setMatchId(id);
        const cards = await API.getInitialCards(id);
        return cards
      }else{
        const cards = await API.getInitialCards(0);
        return cards
      }

    } catch (err) {
      setMessage({ msg: err.message || err, type: 'danger' });
    }
  };

  const handleNewCard = async() => {
    try{
      const card = await API.getCard(matchId)

      return card
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
      <AuthContext.Provider value={{user: user, setUser: setUser}}>
        <Navbar/>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home/:userId" element={<Home />} />
          <Route path="/match" element={<Match handleIntialMatchAndCards={handleInitialMatchAndCards} handleNewCard={handleNewCard} matchId={matchId} />} />
          <Route path="/summury" element={<CardSummary/>} />
        </Routes>
      </AuthContext.Provider>    
    </>
  )
}

export default App
