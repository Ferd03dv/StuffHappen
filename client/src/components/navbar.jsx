import {useContext, useState} from "react";
import { Link } from 'react-router-dom';
import {AuthContext} from "../context/authContext.jsx";
import API from '../API/API.mjs'
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const {user, setUser} = useContext(AuthContext)
  const [message, setMessage] = useState('');
  const navigate = useNavigate()

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
          onClick={handleLogoClick}
          style={{ color: '#FFD100', cursor: 'pointer' }}
        >
          Stuff Happens
        </span>
        <div className="d-flex">
          {user != null ? (
            <Link className="btn btn-outline-light" to="/" onClick={()=>logOut()}>
              Logout
            </Link>
          ) : (
            <Link className="btn btn-warning" to="/signin" style={{ backgroundColor: '#FFD100', color: '#000' }}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

