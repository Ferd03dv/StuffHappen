import { useState } from 'react';
import {useNavigate}from 'react-router-dom';

export default function SignIn({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    handleLogin({ username, password });
    navigate("/home")
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px', color: '#FFD100' }}>
      <h2 className="mb-4">Accedi</h2>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input type="text" className="form-control" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-warning" style={{ backgroundColor: '#FFD100', color: '#000' }}>
          Entra
        </button>
      </form>
    </div>
  );
}

