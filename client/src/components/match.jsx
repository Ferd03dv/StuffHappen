import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import API from '../API/API.mjs';
import Card from './Card';
import { AuthContext } from '../context/authContext.jsx';

export default function Match() {
  const [cards, setCards] = useState([]);
  const [matchId, setMatchId] = useState('');
  const [guessMade, setGuessMade] = useState(false);
  const [guessCorrect, setGuessCorrect] = useState(false);
  const [roundResultVisible, setRoundResultVisible] = useState(false);
  const [successi, setSuccessi] = useState(0);
  const [errori, setErrori] = useState(0);
  const [numeroRound, setNumeroRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const { user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const demo = location.state?.demo ?? false;
  const timerRef = useRef(null);

  const challenger = cards[cards.length - 1];
  const baseCards = cards.slice(0, -1);

  // Inizializza match
  const initMatch = async () => {
    try {
      let fetchedCards;
      if (!demo) {
        const { id } = await API.createMatch(user.id);
        setMatchId(id);
        fetchedCards = await API.getInitialCards(id);
      } else {
        fetchedCards = await API.getInitialCards(0);
      }
      setCards(fetchedCards);
    } catch (err) {
      setMessage(err.message || 'Errore durante il caricamento');
    } finally {
      setLoading(false);
    }
  };

  // Timer
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

  // Nuova carta
  const fetchNewCard = async () => {
    try {
      return await API.getCard(matchId);
    } catch (err) {
      setMessage(err.message || 'Errore durante il recupero carta');
    }
  };

  // Controlla risposta
  const handleGuess = async (min, max) => {
    if (guessMade || successi >= 3 || errori >= 3) return;

    clearInterval(timerRef.current);

    const isCorrect = challenger.indice_sfortuna >= min && challenger.indice_sfortuna < max;

    setGuessMade(true);
    setGuessCorrect(isCorrect);
    setNumeroRound(r => r + 1);

    // Aspetta un attimo, poi mostra risultato
    setTimeout(() => handleRoundResult(isCorrect), 1500);
  };

  const handleRoundResult = async (isCorrect) => {
    if (isCorrect) {
      setSuccessi(s => s + 1);
    } else {
      setErrori(e => e + 1);
    }

    if (!demo) {
      try {
        await API.addRound(matchId, numeroRound, challenger.id, isCorrect);
      } catch (err) {
        console.error('Errore salvataggio round:', err.message);
      }
    }

    setRoundResultVisible(true);
  };

  const handleTimeOut = () => {
    if (!demo && !guessMade && successi < 3 && errori < 3) {
      setGuessMade(true);
      setGuessCorrect(false);
      setNumeroRound(r => r + 1);
      setTimeout(() => handleRoundResult(false), 1500);
    }
  };

  const handleNextRound = async () => {
    const isLastRound = successi === 3 || errori === 3;

    const updatedBase = cards.slice(0, -1); // tutte meno il challenger
    const currentChallenger = cards[cards.length - 1];

    let newDeck = updatedBase;

    if (guessCorrect && !isLastRound) {
      // Aggiungi solo se risposta corretta e non siamo all'ultimo round
      newDeck = [...updatedBase, currentChallenger].sort(
        (a, b) => a.indice_sfortuna - b.indice_sfortuna
      );
    }

    if (!demo && !isLastRound) {
      const newCard = await fetchNewCard();
      if (newCard) {
        newDeck = [...newDeck, newCard];
      }
    }

    setCards(newDeck);
    setGuessMade(false);
    setGuessCorrect(false);
    setTimeLeft(30);
    setRoundResultVisible(false);

    if (!isLastRound) startTimer();
  };

  const handleMatchEnd = async () => {
    try {
      await API.updateMatchResult(matchId, successi === 3 ? 'VINTO' : 'PERSO', successi);
    } catch (err) {
      console.error('Errore salvataggio match:', err.message);
    }
  };

  // useEffect per inizializzazione
  useEffect(() => {
    initMatch();
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  // Timer timeout
  useEffect(() => {
    if (timeLeft === 0) handleTimeOut();
  }, [timeLeft]);

  // Fine partita
  useEffect(() => {
    if (!demo && (successi === 3 || errori === 3)) {
      handleMatchEnd();
      
      navigate(`/summury/${user.id}/${matchId}`, { state: { cards: successi < 3 ? cards.slice(0, -1) :  cards } });
      
    }
  }, [successi, errori]);

  // Se caricamento
  if (loading || cards.length < 4) {
    return (
      <Container className="text-center text-light mt-5">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3">Caricamento carte in corso...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5 text-center text-light">
      <h2>Tempo rimasto: <span className="text-warning">{timeLeft}s</span></h2>

      <Row className="my-4 justify-content-center">
        <Col md={6}>
          <Card card={challenger} showIndice={guessMade} />
        </Col>
      </Row>

      <Row className="mb-4 justify-content-center">
        {[ [1, 25], [25, 50], [50, 75], [75, 100] ].map(([min, max]) => (
          <Col key={min} xs={6} md={3} className="mb-2">
            <Button
              variant="outline-warning"
              className="w-100"
              onClick={() => handleGuess(min, max)}
              disabled={guessMade}
            >
              {min} - {max}
            </Button>
          </Col>
        ))}
      </Row>

      <Row className="justify-content-center">
        {baseCards.map(card => (
          <Col key={card.id} xs={6} md={4} className="mb-3">
            <Card card={card} showIndice={true} />
          </Col>
        ))}
      </Row>

      {/* Messaggio d'esito round */}
      <Modal show={roundResultVisible} centered backdrop="static">
        <Modal.Body className="text-center bg-dark text-light">
          <h3 className={guessCorrect ? 'text-success' : 'text-danger'}>
            {guessCorrect ? 'Hai indovinato!' : 'Sbagliato!'}
          </h3>
          <Button
            variant="warning"
            className="mt-3"
            onClick={() => {
              if (demo) {
                navigate('/');
              } else {
                handleNextRound();
              }
            }}
          >
            {demo ? 'Torna alla home' : 'Prossimo round'}
          </Button>
        </Modal.Body>
      </Modal>


      {/* Messaggio generale */}
      {message && (
        <Alert variant="danger" className="mt-4">
          {message}
        </Alert>
      )}
    </Container>
  );
}

