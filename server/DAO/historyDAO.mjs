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
      CASE WHEN ci.idCarta IS NOT NULL THEN 1 ELSE 0 END AS isIniziali
    FROM PARTITA p
    LEFT JOIN ROUND r ON r.idPartita = p.id
    LEFT JOIN CARTE_INIZIALI ci ON ci.idPartita = p.id AND ci.idCarta = r.idCarta
    LEFT JOIN CARTA c ON c.id = r.idCarta
    WHERE p.userId = ?
    ORDER BY p.date DESC, r.numero_round ASC
  `;

  return new Promise((resolve, reject) => {
    db.all(query, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}
