import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../API/API.mjs';
import Card from './Card';

export default function Match({loggedIn, handleIntialMatchAndCards, handleNewCard, matchId}) {
  const [cards, setCards] = useState([]);
  const [guessMade, setGuessMade] = useState(false);
  const [guessCorrect, setGuessCorrect] = useState(false);
  const [successi, setSuccessi] = useState(0);
  const [errori, setErrori] = useState(0);
  const [numeroRound, setNumeroRound] = useState(1)
  const location = useLocation();
  const demo = location.state?.demo ?? false;
  const navigate = useNavigate();

  useEffect(() => {
    const loadCards = async () => {
      const cards = await handleIntialMatchAndCards();
      setCards(cards);
    };
    loadCards();
  }, []);

  useEffect(() => {
    if (demo && guessMade) {
        const timeout = setTimeout(() => {
        navigate('/');
        }, 2000); 

        return () => clearTimeout(timeout); 
    }
   }, [demo, guessMade, navigate]);

  useEffect(() => {
    if (!demo && (successi === 3 || errori === 3)) {
      const timeout = setTimeout(() => {
        navigate('/home');
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [successi, errori, demo, navigate]);

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

  const handleGuess = async (min, max) => {
    if (guessMade || successi >= 3 || errori >= 3) return;

    const isCorrect = challenger.indice_sfortuna >= min && challenger.indice_sfortuna < max;
    setGuessMade(true);
    setGuessCorrect(isCorrect);
    setNumeroRound((r) => r + 1); 

    if (demo) return;

    setTimeout(async () => {
      if (isCorrect) {
        const newTrio = [...trio, challenger].sort((a, b) => a.indice_sfortuna - b.indice_sfortuna);
        setCards([...newTrio]);
        setSuccessi((s) => s + 1);
      } else {
        setErrori((e) => e + 1);
      }

      try {
        await API.addRound(matchId, numeroRound, challenger.id, isCorrect);
      } catch (err) {
        console.error('Errore salvataggio round:', err);
      }

      const newCard = await handleNewCard();
      setCards((prev) => [...prev.slice(0, 3), newCard]);

      setGuessMade(false);
      setGuessCorrect(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-10 px-4 bg-black text-[#FFD100]">
      {/* Carta sfidante */}
      <div className="mb-10">
        <Card card={challenger} showIndice={guessMade} />
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
          <Card key={card.id} card={card} showIndice={guessMade} />
        ))}
      </div>

      {/* Feedback */}
      {guessMade && (
        <div className={`mt-8 text-lg font-semibold ${guessCorrect ? 'text-green-400' : 'text-red-500'}`}>
          {guessCorrect ? 'Bravo! Hai indovinato!' : 'Peccato! Ritenta!'}
        </div>
      )}

      {(successi === 3 || errori === 3) && (
        <div className="mt-8 text-xl font-bold text-white">
          {successi === 3 ? 'Hai vinto la partita!' : 'Hai perso la partita!'}
        </div>
      )}
    </div>
  );
}
