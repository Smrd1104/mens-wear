// server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectCloudinary from "./config/cloudinary.js";
import connectDB from './config/mongodb.js';
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors());

// API Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);

// === Serve frontend build ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// For React SPA routing (fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Start the server (after everything is set up)
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});





// // server.js
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectCloudinary from "./config/cloudinary.js"
// import connectDB from './config/mongodb.js';
// import userRouter from "./routes/userRoute.js"
// import productRouter from "./routes/productRoute.js"

// dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;
// connectDB();
// connectCloudinary();
// // Middlewares
// app.use(express.json());
// app.use(cors());


// // api endpoints

// app.use('/api/user', userRouter);
// app.use('/api/product', productRouter)

// // Basic Route
// app.get('/', (req, res) => {
//   res.send("API working");
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


