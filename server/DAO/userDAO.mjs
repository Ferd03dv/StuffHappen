import sqlite from 'sqlite3';
import User from '../model/userModel.mjs';
import crypto from 'crypto';

const db = new sqlite.Database('database.db', (err) => {
  if (err) throw err;
});

export const getUser = (username, password) => {
   return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM UTENTE WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = new User(row.id, row.username, row.avatar);

        crypto.scrypt(password, row.salt, 32, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};
