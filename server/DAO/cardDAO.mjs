import sqlite from 'sqlite3';
import Card from '../model/cardModel.mjs'

const  db = new sqlite.Database('database.db', (err) => {
  if (err) throw err;
});

export const getAllCards = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM CARTA';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
      } else if(rows) {
        const cards = rows.map(row => new Card(row.id, row.nome, row.immagine, row.indice_sfortuna));
        resolve(cards);
      }else{
        resolve(null)
      }
    });
  });
};

