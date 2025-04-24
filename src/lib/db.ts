'use server';

import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'librarylook',
};

// Initialize the database connection pool
let pool: mysql.Pool | null = null;

const getPool = async (): Promise<mysql.Pool> => {
  if (!pool) {
    try {
      pool = mysql.createPool(dbConfig);
      const connection = await pool.getConnection();
      console.log('Connected to MySQL!');
      connection.release(); // Release the connection back to the pool
    } catch (error: any) {
      console.error('Error connecting to MySQL:', error.code);
      // Retry connection after a delay if ECONNREFUSED
      if (error.code === 'ECONNREFUSED') {
        console.log('Retrying connection in 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        pool = mysql.createPool(dbConfig);
        const connection = await pool.getConnection();
        console.log('Connected to MySQL!');
        connection.release(); // Release the connection back to the pool
      } else {
        throw error;
      }
    }
  }
  return pool;
};

// Function to execute a query
export const query = async (sql: string, params: any[] = []) => {
  try {
    const pool = await getPool();
    const [rows] = await pool.execute(sql, params);
    return rows;
  } catch (error: any) {
    console.error('MySQL query error:', error.code);
    if (error.code === 'ECONNREFUSED') {
      console.log('Retrying query after connection retry...');
      await getPool(); // Ensure the pool is re-established
      const pool = await getPool();
      const [rows] = await pool.execute(sql, params);
      return rows;
    } else {
      throw error;
    }
  }
};

// Function to execute a non-SELECT query (INSERT, UPDATE, DELETE)
export const execute = async (sql: string, params: any[] = []) => {
  try {
    const pool = await getPool();
    const [result]: any = await pool.execute(sql, params);
    return {
      changes: result.affectedRows,
      lastID: result.insertId,
    };
  } catch (error: any) {
    console.error('MySQL execute error:', error.code);
    if (error.code === 'ECONNREFUSED') {
      console.log('Retrying execute after connection retry...');
      await getPool(); // Ensure the pool is re-established
      const pool = await getPool();
      const [result]: any = await pool.execute(sql, params);
      return {
        changes: result.affectedRows,
        lastID: result.insertId,
      };
    } else {
      throw error;
    }
  }
};

// Function to initialize the database tables
export const initializeDatabase = async () => {
  try {
    await execute(`
      CREATE TABLE IF NOT EXISTS Publishers (
          PublisherID INT AUTO_INCREMENT PRIMARY KEY,
          Name VARCHAR(255) NOT NULL,
          Address TEXT,
          Email VARCHAR(100) UNIQUE,
          Phone VARCHAR(15) UNIQUE
      )
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS Books (
          BookID INT AUTO_INCREMENT PRIMARY KEY,
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

    await execute(`
      CREATE TABLE IF NOT EXISTS MembershipTypes (
          MembershipTypeID INT AUTO_INCREMENT PRIMARY KEY,
          TypeName VARCHAR(100) NOT NULL,
          DurationMonths INT NOT NULL,
          Fee DECIMAL(10,2) NOT NULL
      )
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS Members (
          MemberID INT AUTO_INCREMENT PRIMARY KEY,
          Name VARCHAR(255) NOT NULL,
          Email VARCHAR(100) UNIQUE NOT NULL,
          Phone VARCHAR(15) UNIQUE NOT NULL,
          Address TEXT,
          MembershipTypeID INT,
          MembershipDate DATE DEFAULT (CURDATE()),
          FOREIGN KEY (MembershipTypeID) REFERENCES MembershipTypes(MembershipTypeID) ON DELETE SET NULL
      )
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS Staff (
          StaffID INT AUTO_INCREMENT PRIMARY KEY,
          Name VARCHAR(255) NOT NULL,
          Email VARCHAR(100) UNIQUE NOT NULL,
          Phone VARCHAR(15) UNIQUE NOT NULL,
          Role VARCHAR(50),
          HireDate DATE DEFAULT (CURDATE())
      )
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS Borrowings (
          BorrowID INT AUTO_INCREMENT PRIMARY KEY,
          MemberID INT,
          BookID INT,
          BorrowDate DATE DEFAULT (CURDATE()),
          DueDate DATE NOT NULL,
          ReturnDate DATE,
          StaffID INT,
          FOREIGN KEY (MemberID) REFERENCES Members(MemberID) ON DELETE CASCADE,
          FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE,
          FOREIGN KEY (StaffID) REFERENCES Staff(StaffID) ON DELETE SET NULL
      )
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS Fines (
          FineID INT AUTO_INCREMENT PRIMARY KEY,
          BorrowID INT,
          Amount DECIMAL(10,2) NOT NULL,
          Paid BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (BorrowID) REFERENCES Borrowings(BorrowID) ON DELETE CASCADE
      )
    `);

    await execute(`
      CREATE TABLE IF NOT EXISTS Reservations (
          ReservationID INT AUTO_INCREMENT PRIMARY KEY,
          MemberID INT,
          BookID INT,
          ReservationDate DATE DEFAULT (CURDATE()),
          Status ENUM('Pending', 'Completed', 'Cancelled') DEFAULT 'Pending',
          FOREIGN KEY (MemberID) REFERENCES Members(MemberID) ON DELETE CASCADE,
          FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE
      )
    `);
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
