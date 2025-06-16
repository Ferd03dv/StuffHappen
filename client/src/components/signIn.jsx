import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import API from '../API/API.mjs';
import {AuthContext} from "../context/authContext.jsx";

export default function SignIn({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const {setUser} = useContext(AuthContext)

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const user = await API.logIn({ username, password }) 
      setUser(user)
      navigate(`/home/${user.id}`);
    } catch (error) {
      setMessage(error.message || "Credenziali non valide");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
      <div className="card shadow-lg p-4" style={{ maxWidth: '400px', width: '100%', backgroundColor: '#222', border: 'none' }}>
        <h3 className="text-center text-warning mb-4">Accedi al gioco</h3>

        {message && (
          <div className="alert alert-danger text-center py-2">
            {message}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label text-light">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label text-light">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-warning fw-bold"
              style={{ backgroundColor: '#FFD100', color: '#000' }}
            >
              Entra
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

