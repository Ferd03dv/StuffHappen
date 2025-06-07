import Rel_card_game from '../model/rel_card_game.mjs'
import sqlite from 'sqlite3';

const db = new sqlite.Database('database.db', (err) => {
  if (err) throw err;
});

export const addInitialCardToGame = (idPartita, idCarta) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO CARTE_INIZIALI (idPartita, idCarta) VALUES (?, ?)';
    db.run(sql, [idPartita, idCarta], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};
