import { Link } from 'react-router-dom';

export default function Navbar({ loggedIn, handleLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#000' }}>
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" style={{ color: '#FFD100' }}>
          Stuff Happens
        </Link>
        <div className="d-flex">
          {loggedIn ? (
            <Link className="btn btn-outline-light" to="/" onClick={handleLogout}>
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

