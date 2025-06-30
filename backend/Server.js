// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Basic Route
app.get('/', (req, res) => {
  res.send("API working");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
