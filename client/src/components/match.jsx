import { useEffect, useState, useRef } from 'react';
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
  const [timeLeft, setTimeLeft] = useState(30);
  const [roundResultVisible, setRoundResultVisible] = useState(false);
  const location = useLocation();
  const demo = location.state?.demo ?? false;
  const navigate = useNavigate();
  const displayed = [...cards];
  const challenger = displayed.pop(); 
  let mycards = displayed;
  const timerRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const checkAnswerAndTimer = async (isCorrect, timer) => {
    if (isCorrect && timer > 0) {
      // Aggiungi la carta al mazzo
      setCards((prevCards) => {
        const currentBaseCards = prevCards.slice(0, -1); // rimuovi il challenger
        const newCardList = [...currentBaseCards, prevCards[prevCards.length - 1]];
        return newCardList.sort((a, b) => a.indice_sfortuna - b.indice_sfortuna);
      });
      setSuccessi((s) => s + 1);

      // Solo se non demo, prendi nuova carta
      if (!demo) {
        const newCard = await handleNewCard();
        setCards((prevCards) => [...prevCards, newCard]);
      }

    } else {
      setErrori((e) => e + 1);

      setCards((prevCards) => {
        const currentBaseCards = prevCards.slice(0, -1); // sempre rimuovi challenger se sbagli
        return currentBaseCards;
      });

      if (!demo && errori < 2) {
        const newCard = await handleNewCard();
        setCards((prevCards) => [...prevCards, newCard]); // aggiungi solo se continuerai a giocare
      }
    }

  try {
    await API.addRound(matchId, numeroRound, challenger.id, isCorrect);
  } catch (err) {
    console.error('Errore salvataggio round:', err);
  }

  setGuessMade(true);
  setGuessCorrect(isCorrect);
  setRoundResultVisible(true);
};



  const handleMatchEnd = async () => {
    try {
      await API.updateMatchResult(matchId, successi === 3 ? "VINTO" : "PERSO", successi);
    } catch (err) {
      console.error('Errore durante l\'aggiornamento del risultato della partita:', err.message);
    }
  };

  const handleGuess = async (min, max) => {
    if (guessMade || successi >= 3 || errori >= 3) return;

    clearInterval(timerRef.current);

    const isCorrect = challenger.indice_sfortuna >= min && challenger.indice_sfortuna < max;
    setGuessMade(true);
    setGuessCorrect(isCorrect);
    setNumeroRound((r) => r + 1); 

    if (demo) return;

    setTimeout(async () => {
      await checkAnswerAndTimer(isCorrect, timeLeft)
    }, 1500);
  };

  const handleTimeOut = async () => {
    try {
      await checkAnswerAndTimer(false, timeLeft)
    } catch (err) {
      console.error('Errore nella gestione del timer:', err.message);
    }
  }

  const handleNextRound = async () => {
    if (demo) return;
    setNumeroRound((r) => r + 1);
    setGuessMade(false);
    setGuessCorrect(false);
    setTimeLeft(30);
    setRoundResultVisible(false);
    startTimer();
  };
  
  useEffect(() => {
    const loadCards = async () => {
      const cards = await handleIntialMatchAndCards(demo);
      setCards(cards);
    };
    startTimer();
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
      handleMatchEnd();

      const timeout = setTimeout(() => {
        navigate('/summury', { state: { cards }});
      }, 3000);

      return () => clearTimeout(timeout);
    }
  }, [successi, errori, demo, navigate]);

  useEffect(() => {
    if (timeLeft === 0 && !guessMade && successi < 3 && errori < 3 && !demo) {
      setGuessMade(true);
      setGuessCorrect(false);
      setNumeroRound((r) => r + 1);

      setTimeout(() => {
        handleTimeOut();
      }, 1500);
    }
  }, [timeLeft]);

  
  if (!cards || cards.length < 4) {
    return (
      <div className="text-white text-center mt-10">
        Caricamento carte in corso...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-10 px-4 bg-black text-[#FFD100]">
      <div className="text-white text-2xl font-mono mb-4">
        Tempo rimasto: {timeLeft}s
      </div>

      <div className="mb-10">
        <Card card={challenger} showIndice={guessMade} />
      </div>

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
        {mycards.map((card) => (
          <Card key={card.id} card={card} showIndice={true} />
        ))}
      </div>

      {roundResultVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center text-[#FFD100] z-50">
          <h2 className={`text-3xl font-bold mb-6 ${guessCorrect ? 'text-green-400' : 'text-red-500'}`}>
            {guessCorrect ? 'Hai indovinato!' : 'Sbagliato!'}
          </h2>
          <button
            className="bg-[#FFD100] text-black px-6 py-2 rounded-lg hover:bg-white transition"
            onClick={handleNextRound}
          >
            Prossimo round
          </button>
        </div>
      )}
    </div>
  );
}
