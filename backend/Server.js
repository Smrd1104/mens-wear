// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectCloudinary from "./config/cloudinary.js"
import connectDB from './config/mongodb.js';
import userRouter from "./routes/userRoute.js"
import productRouter from "./routes/productRoute.js"
import cartRouter from './routes/cartRoute.js';
import orderRouter from "./routes/orderRoute.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
connectDB();
connectCloudinary();
// Middlewares
app.use(express.json());
app.use(cors());


// api endpoints

app.use('/api/user', userRouter);
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

// Basic Route
app.get('/', (req, res) => {
  res.send("API working");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


