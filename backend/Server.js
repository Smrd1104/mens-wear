// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import subscriptionRouter from './routes/susubscriptionRoute.js';
import wishlistRouter from './routes/wishlistRoute.js';
import dashboardRouter from './routes/dashboardRoute.js';
import skuRouter from './routes/skuRoute.js';
import reviewRouter from './routes/reviewRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());




const allowedOrigins = [
  'http://localhost:5173',  // frontend local
  'http://localhost:5174',  // admin local
  'https://trends-wear.onrender.com',  // deployed frontend
  'https://mens-wear-admin.onrender.com'  // deployed admin
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


// Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/subscribe', subscriptionRouter);
app.use('/api/wishlist', wishlistRouter);
app.use("/api/dashboard", dashboardRouter);
app.use('/api/sku', skuRouter);
app.use("/api/reviews", reviewRouter);




// Default route
app.get('/', (req, res) => {
  res.send('API working Mohamed');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});










































// // server.js
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectCloudinary from "./config/cloudinary.js"
// import connectDB from './config/mongodb.js';
// import userRouter from "./routes/userRoute.js"
// import productRouter from "./routes/productRoute.js"
// import cartRouter from './routes/cartRoute.js';
// import orderRouter from "./routes/orderRoute.js"

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
// app.use('/api/cart', cartRouter)
// app.use('/api/order', orderRouter)

// // Basic Route
// app.get('/', (req, res) => {
//   res.send("API working");
// });

// // Start server
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });


