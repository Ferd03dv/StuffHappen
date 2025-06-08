function HomePage({ loggedIn, user }) {
  return (
    <div>
      <h1>🏠 Benvenuto nella tua homepage, {user.username}!</h1>
      <p>Qui puoi iniziare a giocare, vedere le tue statistiche, ecc.</p>
    </div>
  );
}

export default HomePage;