'use server';

import sqlite3 from 'sqlite3';

// Initialize the database in memory
const db = new sqlite3.Database(':memory:');

// Function to execute a query
export const query = async (sql: string, params: any[] = []) => {
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
export const execute = async (sql: string, params: any[] = []) => {
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

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Publishers (
        PublisherID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name VARCHAR(255) NOT NULL,
        Address TEXT,
        Email VARCHAR(100) UNIQUE,
        Phone VARCHAR(15) UNIQUE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Books (
        BookID INTEGER PRIMARY KEY AUTOINCREMENT,
        Title VARCHAR(255) NOT NULL,
        Author VARCHAR(255) NOT NULL,
        ISBN VARCHAR(20) UNIQUE NOT NULL,
        Genre VARCHAR(100),
        PublishedYear INT,
        PublisherID INT,
        Quantity INT NOT NULL CHECK (Quantity >= 0),
        FOREIGN KEY (PublisherID) REFERENCES Publishers(PublisherID) ON DELETE SET NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS MembershipTypes (
        MembershipTypeID INTEGER PRIMARY KEY AUTOINCREMENT,
        TypeName VARCHAR(100) NOT NULL,
        DurationMonths INT NOT NULL,
        Fee DECIMAL(10,2) NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Members (
        MemberID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name VARCHAR(255) NOT NULL,
        Email VARCHAR(100) UNIQUE NOT NULL,
        Phone VARCHAR(15) UNIQUE NOT NULL,
        Address TEXT,
        MembershipTypeID INT,
        MembershipDate DATE DEFAULT (DATE('now')),
        FOREIGN KEY (MembershipTypeID) REFERENCES MembershipTypes(MembershipTypeID) ON DELETE SET NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Staff (
        StaffID INTEGER PRIMARY KEY AUTOINCREMENT,
        Name VARCHAR(255) NOT NULL,
        Email VARCHAR(100) UNIQUE NOT NULL,
        Phone VARCHAR(15) UNIQUE NOT NULL,
        Role VARCHAR(50),
        HireDate DATE DEFAULT (DATE('now'))
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Borrowings (
        BorrowID INTEGER PRIMARY KEY AUTOINCREMENT,
        MemberID INT,
        BookID INT,
        BorrowDate DATE DEFAULT (DATE('now')),
        DueDate DATE NOT NULL,
        ReturnDate DATE,
        StaffID INT,
        FOREIGN KEY (MemberID) REFERENCES Members(MemberID) ON DELETE CASCADE,
        FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE,
        FOREIGN KEY (StaffID) REFERENCES Staff(StaffID) ON DELETE SET NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Fines (
        FineID INTEGER PRIMARY KEY AUTOINCREMENT,
        BorrowID INT,
        Amount DECIMAL(10,2) NOT NULL,
        Paid BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (BorrowID) REFERENCES Borrowings(BorrowID) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Reservations (
        ReservationID INTEGER PRIMARY KEY AUTOINCREMENT,
        MemberID INT,
        BookID INT,
        ReservationDate DATE DEFAULT (DATE('now')),
        Status TEXT DEFAULT 'Pending',
        FOREIGN KEY (MemberID) REFERENCES Members(MemberID) ON DELETE CASCADE,
        FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE
    )
  `);
});

export default db;
