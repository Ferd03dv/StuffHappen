import { useState } from 'react';
import GameRuleCard from './gameRuleCard.jsx';
import GetStartedPopUp from './getStartedPopUp.jsx';

export default function LandingPage() {
  const [showPopUp, setPopUp] = useState(false);

  return (
    <div className="container text-center mt-5" style={{ color: '#FFD100' }}>
      <h1 className="mb-4">Benvenuto in Stuff Happens</h1>
      <button className="btn btn-warning mb-4" style={{ backgroundColor: '#FFD100', color: '#000' }} onClick={() => setPopUp(true)}>
        Demo
      </button>

      {showPopUp && <GetStartedPopUp onCancel={() => setPopUp(false)} demo={true}/>}

      <GameRuleCard section={"rules"} />
    </div>
  );
}
