import { useContext, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Container, Button, Alert } from 'react-bootstrap';
import { AuthContext } from "../context/authContext.jsx";
import API from '../API/API.mjs';

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

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
  };

  const handleLogoClick = () => {
    if (user != null) {
      logOut();
    }
    navigate('/');
  };

  return (
    <>
      <BootstrapNavbar variant="dark" expand="lg" className="shadow-sm">
        <Container fluid>
          <BootstrapNavbar.Brand
            onClick={!isInMatch ? handleLogoClick : undefined}
            style={{ 
              color: '#FFD100', 
              cursor: isInMatch ? 'default' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Stuff Happens
          </BootstrapNavbar.Brand>
          
          <div className="d-flex">
            {user != null ? (
              <Button
                variant="warning"
                className="fw-bold"
                onClick={!isInMatch ? logOut : undefined}
                disabled={isInMatch}
                style={{ 
                  opacity: isInMatch ? 0.5 : 1, 
                  cursor: isInMatch ? 'not-allowed' : 'pointer' 
                }}
              >
                Logout
              </Button>
            ) : (
              <Button
                variant="warning"
                className="fw-bold"
                onClick={() => { if (!isInMatch) navigate('/signin'); }}
                disabled={isInMatch}
                style={{ 
                  opacity: isInMatch ? 0.5 : 1, 
                  cursor: isInMatch ? 'not-allowed' : 'pointer' 
                }}
              >
                Login
              </Button>
            )}
          </div>
        </Container>
      </BootstrapNavbar>
      
      {message && (
        <Alert variant="danger" className="mb-0">
          {message}
        </Alert>
      )}
    </>
  );
}

