import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import GetStartedPopUp from './getStartedPopUp.jsx';

export default function CardSummary() {
  const [showPopUp, setPopUp] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cards = location.state?.cards ?? [];

  if (!cards || cards.length === 0) {
    return <div className="text-white text-center mt-10">Nessuna carta da mostrare.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      <button className="btn btn-warning mb-4" style={{ backgroundColor: '#FFD100', color: '#000' }} onClick={() => setPopUp(true)}>
              Nuova Partita
            </button>
       {showPopUp && <GetStartedPopUp onCancel={() => setPopUp(false)} demo={false}/>}
      
      <button className="btn btn-warning mb-4" style={{ backgroundColor: '#FFD100', color: '#000' }} onClick={() => {navigate("/home")}}>
              Torna alla Home
            </button>
      {cards.map((card) => (
        <div key={card.id} className="bg-black border border-[#FFD100] rounded-xl p-4 text-[#FFD100] shadow-lg">
          <h3 className="text-xl font-bold mb-2">{card.nome}</h3>
          <img
            src={card.immagine}
            alt={card.nome}
            className="w-full h-48 object-cover rounded-md mb-3"
          />
          <p className="text-sm">Indice di sfortuna: <span className="font-mono">{card.indice_sfortuna}</span></p>
        </div>
      ))}
    </div>
  );
}
