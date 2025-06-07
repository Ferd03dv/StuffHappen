import Round from '../model/roundModel.mjs'; 
import sqlite from 'sqlite3';

const db = new sqlite.Database('database.db', (err) => {
  if (err) throw err;
});

export const addRound = (idPartita, numeroRound, idCarta, vinta) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO ROUND (numero_round, idPartita, idCarta, vinta) VALUES (?, ?, ?, ?)';
    db.run(sql, [numeroRound, idPartita, idCarta, vinta], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve("Round Created"); 
      }
    });
  });
};

export const getRoundsByPartitaId = (idPartita) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ROUND WHERE idPartita = ? ORDER BY numero_round ASC';
    db.all(sql, [idPartita], (err, row) => {
      if (err) {
        reject(err);
      } else if (row) {
        const round = new Round(row.id, row.numeroRound, row.idPartita, row.idCarta. row.vinta)
        resolve(round);
      }else{
        resolve(null)
      }
    });
  });
};
