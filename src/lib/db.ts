'use server';

import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(':memory:');

// Function to execute a query
export const query = (sql: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Database query error:', err);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Function to execute a non-SELECT query (INSERT, UPDATE, DELETE)
export const execute = (sql: string, params: any[] = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Database execute error:', err);
        reject(err);
      } else {
        resolve({ changes: this.changes, lastID: this.lastID }); // 'this' context contains info about the execution
      }
    });
  });
};

export default db;
