import GameRuleCard from './gameRuleCard.jsx';

export default function LandingPage() {
  return (
    <div className="container text-center mt-5" style={{ color: '#FFD100' }}>
      <h1 className="mb-4">Benvenuto in Stuff Happens</h1>
      <button className="btn btn-warning mb-4" style={{ backgroundColor: '#FFD100', color: '#000' }}>
        Demo
      </button>
      <GameRuleCard section={"rules"} />
    </div>
  );
}
