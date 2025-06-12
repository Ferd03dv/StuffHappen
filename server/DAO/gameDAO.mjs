import Game from '../model/gameModel.mjs'; 
import sqlite from 'sqlite3';
import dayjs from 'dayjs';

const db = new sqlite.Database('database.db', (err) => {
  if (err) throw err;
});

export const addGame = (userId, risultato, carte_vinte) => {
  return new Promise((resolve, reject) => {
    const currentDate = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const sql = 'INSERT INTO PARTITA (userId, date, risultato, carte_vinte) VALUES (?, ?, ?, ?)';
    db.run(sql, [userId, currentDate, risultato, carte_vinte], function (err) {
      if (err) {
        reject(err);
      } else {
        const game = new Game(this.lastID, currentDate, userId, risultato, carte_vinte);
        resolve(game);
      }
    });
  });
};

export const listGamesByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM PARTITA WHERE userId = ? ORDER BY data DESC';
    db.all(sql, [userId], (err, rows) => {
      if (err) {
        reject(err);
      } else if(rows) {
        const games = rows.map(row => new Game(row.id, row.data, row.userId, row.risultato, row.carte_vinte));
        resolve(games);
      }else{
        resolve(null)
      }
    });
  });
};

export const updateGameResult = (idPartita, risultato, carte_vinte) => {
  return new Promise((resolve, reject) => {
     const sql = `UPDATE PARTITA SET risultato = ?, carte_vinte = ? WHERE id = ?`;
    db.run(sql, [risultato, carte_vinte, idPartita], function(err) {
      if (err) {
        reject(err);
      } else {
        resolve("updated")
      }
    });
  });
}


