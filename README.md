[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/uNTgnFHD)
# Exam #1: "Gioco della sfortuna"
## Student: s347426 DEL VECCHIO FERDINANDO 

## React Client Application Routes

## Routes

### `/`
- **Component**: `LandingPage`
- **Description**: Pagina iniziale dell'applicazione. Serve da punto d'ingresso per tutti gli utenti, mostrando una panoramica generale o un invito all'accesso.

### `/signin`
- **Component**: `SignIn`
- **Description**: Pagina di accesso. Permette agli utenti registrati di autenticarsi tramite email e password (o altri metodi, se implementati).

### `/home/:userId`
- **Component**: `Home`
- **Description**: Dashboard personale dell’utente.
- **Parametri**:
  - `userId`: identificatore univoco dell’utente loggato. La pagina mostra contenuti personalizzati basati sull'utente.

### `/match/:userId`
- **Component**: `Match`
- **Description**: Pagina dedicata alla logica di match (ad es. matchmaking, confronto o selezione).
- **Parametri**:
  - `userId`: identificatore dell’utente per il quale viene effettuato il match.

### `/summury/:userId/:matchId`
- **Component**: `CardSummary`
- **Description**: Mostra un riepilogo o report relativo a un match specifico per un utente.
- **Parametri**:
  - `userId`: identificatore dell’utente.
  - `matchId`: identificatore del match di cui mostrare il riepilogo.


## API Server

### Autenticazione

- **POST** `/api/sessions`
  - **Request Body**: `{ username: string, password: string }`
  - **Response**: `201 Created` con l'oggetto `req.user` se autenticato correttamente

- **GET** `/api/sessions/current`
  - **Response**: 
    - `200 OK` con l'oggetto `req.user` se autenticato
    - `401 Unauthorized` se non autenticato

- **DELETE** `/api/sessions/current`
  - **Response**: `200 OK` (senza body) dopo il logout

---

### Gestione Partite

- **POST** `/api/games`
  - **Auth Required**
  - **Request Body**: `{ userId: number }`
  - **Response**:
    - `201 Created` con `{ id: number }`
    - `400 Bad Request` se `userId` mancante
    - `422 Unprocessable Entity` per errori di validazione
    - `503 Service Unavailable` per errori DB

- **PATCH** `/api/games/:idPartita`
  - **Auth Required**
  - **Request Params**: `idPartita: number`
  - **Request Body**: `{ risultato: string, carte_vinte: number }`
  - **Response**:
    - `200 OK` con `{ message: 'Modified' }`
    - `400 Bad Request`, `404 Not Found`, `422 Unprocessable Entity`, `503 Service Unavailable`

- **GET** `/api/history/:userId`
  - **Auth Required**
  - **Request Params**: `userId: number`
  - **Response**:
    - `200 OK` con la lista delle partite dell’utente
    - `400 Bad Request` se `userId` non valido
    - `500 Internal Server Error` in caso di errore DB

---

### Gestione Carte

- **GET** `/api/cards/:idPartita`
  - **Request Params**: `idPartita: string`
  - **Response**:
    - `200 OK` con array di carte iniziali
    - `400 Bad Request`, `404 Not Found`, `503 Service Unavailable`

- **GET** `/api/cards/single/:idPartita`
  - **Auth Required**
  - **Request Params**: `idPartita: string`
  - **Response**:
    - `200 OK` con una singola carta casuale o selezionata
    - `400 Bad Request`, `404 Not Found`, `503 Service Unavailable`

- **POST** `/api/partite/:id/carte-iniziali`
  - **Auth Required**
  - **Request Params**: `id: number`
  - **Request Body**: `{ idCarta: string }`
  - **Response**:
    - `201 Created` con `{ relationId: number }`
    - `400 Bad Request`, `422 Unprocessable Entity`, `503 Service Unavailable`

---

### Gestione Round

- **POST** `/api/partite/:idPartita/round`
  - **Auth Required**
  - **Request Params**: `idPartita: number`
  - **Request Body**:
    ```json
    {
      "numero_round": "number",
      "idCarta": "string",
      "vinta": "boolean"
    }
    ```
  - **Response**:
    - `201 Created` con messaggio `"Added"`
    - `400 Bad Request`, `422 Unprocessable Entity`, `503 Service Unavailable`


## Database Tables

- **Table `CARTA`**
  - Contiene le carte utilizzate nel gioco.
  - **Campi**:
    - `id`: identificatore univoco della carta (PK, autoincrement).
    - `nome`: nome della carta (es. "Specchio rotto").
    - `immagine`: percorso o URL dell'immagine associata (opzionale).
    - `indice_sfortuna`: valore reale che rappresenta il livello di sfortuna associato alla carta (UNIQUE).

- **Table `PARTITA`**
  - Rappresenta una sessione di gioco effettuata da un utente.
  - **Campi**:
    - `id`: identificatore univoco della partita (PK, autoincrement).
    - `date`: data e ora della partita (default: timestamp corrente).
    - `userId`: riferimento all’utente che ha giocato (FK verso `USER.id`).
    - `risultato`: esito della partita, può essere solo `'VINTO'` o `'PERSO'`.
    - `carte_vinte`: numero di carte vinte nella partita (intero ≥ 0).

- **Table `CARTE_INIZIALI`**
  - Relazione molti-a-molti tra partite e carte iniziali selezionate.
  - **Campi**:
    - `idPartita`: ID della partita (PK, FK verso `PARTITA.id`).
    - `idCarta`: ID della carta (PK, FK verso `CARTA.id`).

- **Table `ROUND`**
  - Rappresenta un singolo round giocato all’interno di una partita.
  - **Campi**:
    - `id`: identificatore univoco del round (PK, autoincrement).
    - `numero_round`: numero del round (es. 1, 2, 3...).
    - `idPartita`: ID della partita di riferimento (FK verso `PARTITA.id`).
    - `idCarta`: carta giocata nel round (FK verso `CARTA.id`).
    - `vinta`: booleano (0 = persa, 1 = vinta) che indica se il round è stato vinto.
  - Vincolo: una stessa carta può comparire al massimo una volta per partita (`UNIQUE(idPartita, idCarta)`).


## Main React Components

- `Card` (in `card.jsx`): Componente usato per definire una card
- `GameRuleCard` (in `gameRuleCard.jsx`): Componente usato per definire il blocco nella homepage in cui è specificato il regolamento e le statistiche
- `GetStartedPopUp` (in `getStartedPopUp.jsx`): Componente usato per definire il popUp che viene visualizzato prima di iniziare una partita
- `Homepage` (in `homepage.jsx`): Componente usato per la homepage in cui sono presenti bottoni per iniziare la partita e il GameRuleCard
- `LandingPage` (in `LandingPage.jsx`): Componente usato per la prima pagina iniziale del gioco in cui è presente il bottone per iniziare la partita demo e il GameRuleCard
- `Match` (in `match.jsx`): Componente usato per gestire il match, il timer, le risposte di un utente e verificare se queste sono corrette oppure no. Richiama il componente Cart
- `Navbar` (in `navbar.jsx`): Componente usato per la navigazione in cui devi è presente la gestione del login/logout e la navigazione alla landing page
- `signIn` (in `SignIn.jsx`): Componente usato per gestire l'autenticazione con un form adattatto allo scopo e la gestione dei relativi errori
-`statisticCard` (in `StatisticCard.jsx`): Componente usato per la crezione della card per le statistiche di gioco delle precedenti partite
- `summury` (in `Summury.jsx`): Componente usato visualizzare tutte le carte in possesso da un utente al termine della partita

(only _main_ components, minor ones may be skipped)

## Screenshot

**Gioco**
![Screenshot](/img/gioco.png)

**Statistiche**
![Screenshot](/img/statistiche.png)

## Users Credentials

- ferdinando, Prova123. 
- giovanni, seconda_password 

