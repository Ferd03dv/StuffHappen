import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Match({loggedIn, handleIntialCards}) {
  const [cards, setCards] = useState([]);
  const [guessMade, setGuessMade] = useState(false);
  const [guessCorrect, setGuessCorrect] = useState(false);
  const location = useLocation();
  const demo = location.state?.demo ?? false;
  const navigate = useNavigate();

  useEffect(() => {
    const loadCards = async () => {
      const result = await handleIntialCards();
      setCards(result);
    };
    loadCards();
  }, [handleIntialCards]);

  useEffect(() => {
    if (demo && guessMade) {
        const timeout = setTimeout(() => {
        navigate('/');
        }, 2000); 

        return () => clearTimeout(timeout); 
    }
   }, [demo, guessMade, navigate]);

  if (!cards || cards.length < 4) {
  return (
    <div className="text-white text-center mt-10">
      Caricamento carte in corso...
    </div>
  );
}

  const displayed = [...cards];
  const challenger = displayed.pop(); 
  const trio = displayed;

  const handleGuess = (min, max) => {
    if (guessMade) return;

    const isCorrect = challenger.indice_sfortuna >= min && challenger.indice_sfortuna < max;
    setGuessMade(true);
    setGuessCorrect(isCorrect);

    if (isCorrect) {
      const newTrio = [...trio, challenger].sort((a, b) => a.indice_sfortuna - b.indice_sfortuna);
      setCards([...newTrio]); // aggiorniamo solo il trio ordinato
    }
  };

  const CardComponent = ({ card }) => (
    <div className="border border-white rounded-xl p-4 m-2 bg-black text-center w-[150px]">
      <p className="font-bold text-[#FFD100]">{card.nome}</p>
      <img src={card.immagine} alt={card.nome} className="w-full h-[100px] object-cover rounded-md mb-2" />
      {guessMade && (
        <p className="text-sm text-white">Indice: {card.indice_sfortuna.toFixed(1)}</p>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-10 px-4 bg-black text-[#FFD100]">
      {/* Carta sfidante */}
      <div className="mb-10">
        <CardComponent card={challenger} />
      </div>

      {/* Bottoni */}
      <div className="flex justify-center gap-4 flex-wrap mb-10 px-4 w-full max-w-md mx-auto">
        {[ [1, 25], [25, 50], [50, 75], [75, 100] ].map(([min, max]) => (
          <button
            key={`${min}-${max}`}
            onClick={() => handleGuess(min, max)}
            disabled={guessMade}
            className="px-4 py-2 border border-white rounded-md hover:bg-[#FFD100] hover:text-black transition"
          >
            {min} - {max}
          </button>
        ))}
      </div>

      {/* Le 3 carte base */}
      <div className="flex justify-center gap-4 flex-row flex-wrap w-full max-w-3xl mx-auto">
        {trio.map((card) => (
            <CardComponent key={card.id} card={card} />
        ))}
      </div>

      {/* Feedback */}
      {guessMade && (
        <div className={`mt-8 text-lg font-semibold ${guessCorrect ? 'text-green-400' : 'text-red-500'}`}>
          {guessCorrect ? 'Bravo! Hai indovinato!' : 'Peccato! Ritenta!'}
        </div>
      )}
    </div>
  );
}
