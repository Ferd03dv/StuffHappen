import sqlite from 'sqlite3';

const db = new sqlite.Database('database.db', (err) => {
  if (err) throw err;
});

export function getFullHistoryByUser(userId) {
  const query = `
    SELECT
      p.id AS idPartita,
      p.date,
      p.risultato,
      p.carte_vinte,
      c.id AS idCarta,
      c.nome,
      c.immagine,
      c.indice_sfortuna,
      r.numero_round AS numeroRound,
      r.vinta,
      1 AS isIniziali
    FROM PARTITA p
    JOIN CARTE_INIZIALI ci ON ci.idPartita = p.id
    JOIN CARTA c ON c.id = ci.idCarta
    LEFT JOIN ROUND r ON r.idPartita = p.id AND r.idCarta = ci.idCarta

    UNION

    SELECT
      p.id AS idPartita,
      p.date,
      p.risultato,
      p.carte_vinte,
      c.id AS idCarta,
      c.nome,
      c.immagine,
      c.indice_sfortuna,
      r.numero_round AS numeroRound,
      r.vinta,
      0 AS isIniziali
    FROM PARTITA p
    JOIN ROUND r ON r.idPartita = p.id
    JOIN CARTA c ON c.id = r.idCarta
    WHERE NOT EXISTS (
      SELECT 1 FROM CARTE_INIZIALI ci
      WHERE ci.idPartita = p.id AND ci.idCarta = r.idCarta
    )
    WHERE p.userId = ?
    ORDER BY date DESC, idPartita DESC, isIniziali DESC, numeroRound ASC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

