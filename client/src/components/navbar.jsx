import { Link } from 'react-router-dom';

function Navbar({ loggedIn, handleLogout }) {
  return (
    <nav>
      <Link to="/">Home</Link> |{" "}
      {loggedIn ? (
        <>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/signin">Login</Link>
      )}
    </nav>
  );
}

export default Navbar;
