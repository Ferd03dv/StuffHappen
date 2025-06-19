import {useContext, useState} from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {AuthContext} from "../context/authContext.jsx";
import API from '../API/API.mjs'

export default function Navbar() {
  const {user, setUser} = useContext(AuthContext)
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

  const isInMatch = location.pathname.startsWith('/match');

  const logOut = async () => {
    try {
        await API.logOut();
        setUser(null);
        navigate("/");
    } catch (e) {
        console.log(e);
        setMessage(e.message);
    }
  }

  const handleLogoClick = () => {
    if (user != null) {
      logOut();
    }
    navigate('/');
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#000' }}>
      <div className="container-fluid">
        <span
          className="navbar-brand"
          onClick={!isInMatch ? handleLogoClick : undefined}
          style={{ color: '#FFD100', cursor: 'pointer' }}
        >
          Stuff Happens
        </span>
        <div className="d-flex">
          {user != null ? (
            <button
              className="btn btn-outline-light"
              onClick={!isInMatch ? logOut : undefined}
              disabled={isInMatch}
              style={{ opacity: isInMatch ? 0.5 : 1, cursor: isInMatch ? 'not-allowed' : 'pointer' }}
            >
              Logout
            </button>
          ) : (
            <button
              className="btn btn-warning"
              onClick={() => {if (!isInMatch) navigate('/signin');}}
              disabled={isInMatch}
              style={{ backgroundColor: '#FFD100', color: '#000'}}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

