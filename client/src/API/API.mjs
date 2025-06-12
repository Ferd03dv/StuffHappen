const SERVER_URL = "http://localhost:3001";

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user; 
  }
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

const getStatistic = async (id) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/history/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const statistic = await response.json();

    if (!response.ok) {
      throw new Error(statistic.error || 'Errore sconosciuto');
    }

    return statistic;
  } catch (err) {
    console.error('Errore fetch statistiche:', err.message);
    throw err;
  }
};

const getInitialCards = async (idPartita) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/cards/${idPartita}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error || 'Errore sconosciuto');
    }

    if (!Array.isArray(result)) {
      throw new Error('Dati ricevuti non validi');
    }

    return result;
  } catch (err) {
    console.error('Errore fetch carte iniziali:', err.message);
    throw err;
  }
}

const getCard = async (idPartita) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/cards/single/${idPartita}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const card = await response.json();

    if (!response.ok) {
      throw new Error(card.error || 'Errore sconosciuto');
    }

    return card;
  } catch (err) {
    console.error('Errore fetch carta:', err.message);
    throw err;
  }
};

const createMatch = async (userId) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/games`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "userId": userId
      })
    });

    const idPartita = await response.json();

    if (!response.ok) {
      throw new Error(idPartita.error || 'Errore sconosciuto');
    }

    return idPartita;
  } catch (err) {
    console.error('Errore durante la creazione della partita:', err.message);
    throw err;
  }
}

const addRound = async (idPartita, numero_round, idCarta, vinta) => {
  try {
    const response = await fetch(`${SERVER_URL}/api/partite/${idPartita}/round`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        numero_round,
        idCarta,
        vinta,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Errore sconosciuto');
    }

    return await response.json();
  } catch (err) {
    console.error('Errore durante la creazione del round:', err.message);
    throw err;
  }
};


const API = { logIn, getUserInfo, logOut, getStatistic, getInitialCards, getCard, createMatch, addRound};
export default API;