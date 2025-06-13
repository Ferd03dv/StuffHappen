import { useState } from 'react';
import GameRuleCard from './gameRuleCard.jsx';
import GetStartedPopUp from './getStartedPopUp.jsx';

export default function Home({loggedIn, user, handleStatistic}) {
  const [section, setSection] = useState('rules');
  const [stats, setStats] = useState(null);
  const [showPopUp, setPopUp] = useState(false);

  const loadStats = async () => {
    try {
      const result = await handleStatistic();
      setStats(result);
    } catch (err) {
      console.error(err);
      setStats([]); 
    }
  };

  return (
    <div className="container text-center mt-5" style={{ color: '#FFD100', position: 'realtive' }}>
      <h2 className="mb-4">Benvenuto!</h2>

      <button className="btn btn-warning mb-4" style={{ backgroundColor: '#FFD100', color: '#000' }} onClick={() => setPopUp(true)}>
        Nuova Partita
      </button>

      {showPopUp && <GetStartedPopUp onCancel={() => setPopUp(false)} demo={false}/>}

      <div className="d-flex justify-content-center mb-3">
        <button
          className={`btn me-2 ${section === 'rules' ? 'btn-warning' : 'btn-outline-light'}`}
          onClick={() => setSection('rules')}
        >
          Regole
        </button>
        <button
          type = "submit"
          className={`btn ${section === 'stats' ? 'btn-warning' : 'btn-outline-light'}`}
          onClick={() => {
            loadStats()
            setSection('stats');  
          }}>
          Statistiche
        </button>
      </div>

      <GameRuleCard section={section} loggedIn={loggedIn} stats={stats} />
    </div>
  );
}
