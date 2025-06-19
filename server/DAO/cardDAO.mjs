import sqlite from 'sqlite3';
import Card from '../model/cardModel.mjs'

const  db = new sqlite.Database('database.db', (err) => {
  if (err) throw err;
});

export const getInitialCards = (idPartita) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM CARTA ORDER BY RANDOM() LIMIT 4';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else if (rows) {
        const cards = rows.map(row => new Card(row.id, row.nome, row.immagine, row.indice_sfortuna));

        const sortedFirstThree = [...cards.slice(0, 3)].sort((a, b) => a.indice_sfortuna - b.indice_sfortuna);
        const fourthCard = cards[3];

        if (Number(idPartita) !== 0) {
          const insertSql = 'INSERT INTO CARTE_INIZIALI (idPartita, idCarta) VALUES (?, ?)';
          sortedFirstThree.forEach(card => {
            db.run(insertSql, [idPartita, card.id], (err) => {
              if (err) {
                console.error('Error inserting into CARTE_INIZIALI:', err);
              }
            });
          });
        }

        resolve([...sortedFirstThree, fourthCard]);
      } else {
        resolve(null);
      }
    });
  });
};


export const getCard = (idPartita) => {
  return new Promise((resolve, reject) => {
    const getInitialCardsSql = 'SELECT idCarta FROM CARTE_INIZIALI WHERE idPartita = ?';
    db.all(getInitialCardsSql, [idPartita], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const initialCardIds = rows.map(row => row.idCarta);

        let sql = 'SELECT * FROM CARTA';
        let params = [];
        if (initialCardIds.length > 0) {
          const placeholders = initialCardIds.map(() => '?').join(',');
          sql += ` WHERE id NOT IN (${placeholders})`;
          params = initialCardIds;
        }
        sql += ' ORDER BY RANDOM() LIMIT 1';

        db.get(sql, params, (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            const card = new Card(row.id, row.nome, row.immagine, row.indice_sfortuna);
            resolve(card);
          } else {
            resolve(null);
          }
        });
      }
    });
  });
};



