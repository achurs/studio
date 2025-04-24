'use server';

import db from "@/lib/db";

export const initializeDatabase = async () => {
  try {
    // Table for publishers
    await execute(`
      CREATE TABLE IF NOT EXISTS Publishers (
          PublisherID INTEGER PRIMARY KEY AUTOINCREMENT,
          Name VARCHAR(255) NOT NULL,
          Address TEXT,
          Email VARCHAR(100) UNIQUE,
          Phone VARCHAR(15) UNIQUE
      )
    `);

    // Table for storing book details
    await execute(`
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

    // Table for membership types
    await execute(`
      CREATE TABLE IF NOT EXISTS MembershipTypes (
          MembershipTypeID INTEGER PRIMARY KEY AUTOINCREMENT,
          TypeName VARCHAR(100) NOT NULL,
          DurationMonths INT NOT NULL,
          Fee DECIMAL(10,2) NOT NULL
      )
    `);

    // Table for library members
    await execute(`
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

    // Table for staff
    await execute(`
      CREATE TABLE IF NOT EXISTS Staff (
          StaffID INTEGER PRIMARY KEY AUTOINCREMENT,
          Name VARCHAR(255) NOT NULL,
          Email VARCHAR(100) UNIQUE NOT NULL,
          Phone VARCHAR(15) UNIQUE NOT NULL,
          Role VARCHAR(50),
          HireDate DATE DEFAULT (DATE('now'))
      )
    `);

    // Table for borrowing transactions
    await execute(`
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

    // Table for fines
    await execute(`
      CREATE TABLE IF NOT EXISTS Fines (
          FineID INTEGER PRIMARY KEY AUTOINCREMENT,
          BorrowID INT,
          Amount DECIMAL(10,2) NOT NULL,
          Paid BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (BorrowID) REFERENCES Borrowings(BorrowID) ON DELETE CASCADE
      )
    `);

    // Table for book reservations
    await execute(`
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
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

const query = async (sql: string, params: any[] = []) => {
  try {
    const result = await db.query(sql, params);
    return result;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

const execute = async (sql: string, params: any[] = []) => {
  try {
    const result = await db.execute(sql, params);
    return result;
  } catch (error) {
    console.error("Error executing execute:", error);
    throw error;
  }
};

export { query, execute };
