import express from "express"
import cors from "cors"
import morgan from "morgan"
import {check, validationResult} from 'express-validator';
import {getUser} from './DAO/userDAO.mjs';
import {addGame, listGamesByUserId, updateGameResult} from './DAO/gameDAO.mjs';
import {getInitialCards, getCard} from './DAO/cardDAO.mjs';
import { addRound, getRoundsByPartitaId } from "./DAO/roundDAO.mjs";
import { addInitialCardToGame} from './DAO/rel_card_gameDAO.mjs'
import { getFullHistoryByUser } from './DAO/historyDAO.mjs';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

const app = new express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessState: 200,
  credentials: true
};

app.use(cors(corsOptions));

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

app.post('/api/sessions', passport.authenticate('local'), function(req, res) {
  return res.status(201).json(req.user);
});

app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.post('/api/games', isLoggedIn, [
  check("userId").isInt()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const risultato = "PERSO";
  const carte_vinte = 0;

  const {userId} = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'Missing userId in request body' });
  }

  try {
    const game = await addGame(userId, risultato, carte_vinte);
    res.status(201).json({ id: game.id });
  } catch (err) {
    console.error('Error creating game:', err);
    res.status(503).json({ error: 'Database error while creating game' });
  }
});

app.patch('/api/games/:idPartita', isLoggedIn, [
  check("risultato").notEmpty().withMessage('risultato non può essere empty'),
  check("carte_vinte").isInt().withMessage('carte_vinte deve essere un intero')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const idPartita = parseInt(req.params.idPartita);
  const { risultato, carte_vinte } = req.body;

  if (isNaN(idPartita)) {
    return res.status(400).json({ error: 'ID partita non valido' });
  }

  try {
    const success = await updateGameResult(idPartita, risultato, carte_vinte);

    if (!success) {
      return res.status(404).json({ error: 'Partita non trovata' });
    }

    res.status(200).json({ message: 'Modified' });
  } catch (err) {
    console.error('Errore aggiornamento partita:', err);
    res.status(503).json({ error: 'Errore database durante aggiornamento' });
  }
});



app.get('/api/history/:userId', isLoggedIn, async (req, res) => {
  const { userId } = req.params;

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'userId non valido' });
  }

  try {
    const history = await getFullHistoryByUser(userId);
    res.status(200).json(history);
  } catch (err) {
    console.error(`Errore nella history: ${err.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/cards/:idPartita', async (req, res) => {
  const { idPartita } = req.params

  if(idPartita.isEmpty){
     return res.status(400).json({ error: 'idPartita Non valido' });
  }

  try {
    const cards = await getInitialCards(idPartita);
    if (!cards) {
      return res.status(404).json({ error: 'Cards not found' });
    }
    res.json(cards);
  } catch (err) {
    console.error('Error retrieving card:', err);
    res.status(503).json({ error: 'Database error while retrieving card' });
  }
});

app.get('/api/cards/single/:idPartita', isLoggedIn, async (req, res) => {
  const { idPartita } = req.params

  if(idPartita.isEmpty){
     return res.status(400).json({ error: 'idPartita Non valido' });
  }

  try {
    const card = await getCard();
    if (!card) {
      return res.status(404).json({ error: 'Card not found' });
    }
    res.json(card);
  } catch (err) {
    console.error('Error retrieving card:', err);
    res.status(503).json({ error: 'Database error while retrieving card' });
  }
});

app.post('/api/partite/:idPartita/round', isLoggedIn, [
  check('numero_round').isInt({ min: 1 }).withMessage('numero_round deve essere un intero positivo'),
  check('idCarta').notEmpty().withMessage('idCarta non può essere empty'),
  check('vinta').isBoolean().withMessage('vinta deve essere boleano'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res.status(422).json({ errors: errors.array() });
  }

  const idPartita = req.params.idPartita;
  const { numero_round, idCarta, vinta } = req.body;

  if (isNaN(idPartita)) {
    return res.status(400).json({ error: 'ID partita non valido' });
  }

  try {
    const roundId = await addRound(idPartita, numero_round, idCarta, vinta);
    res.status(201).json("Added")
  } catch (err) {
    console.error('Errore durante la creazione del round:', err);
    res.status(503).json({ error: 'Errore database durante la creazione del round' });
  }
});

app.post('/api/partite/:id/carte-iniziali', isLoggedIn, [
  check('idCarta').notEmpty().withMessage('idCarta è richiesto'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

  const idPartita = parseInt(req.params.id);
  const { idCarta } = req.body;

  if (isNaN(idPartita)) return res.status(400).json({ error: 'ID partita non valido' });

  try {
    const relationId = await addInitialCardToGame(idPartita, idCarta);
    res.status(201).json({ relationId });
  } catch (err) {
    console.error('Errore durante inserimento carta iniziale:', err);
    res.status(503).json({ error: 'Errore DB durante inserimento carta iniziale' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});