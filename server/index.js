import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('MySQL Connected');
});

app.get('/locations', (req, res) => {
  db.query('SELECT * FROM locations', (err, results) => {
    if (err) return res.status(500).json({ message: "Database query failed" });
    res.json(results);
  });
});

app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ message: "Database query failed" });
    res.json(results);
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});