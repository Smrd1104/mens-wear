import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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

// Configure __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ===== CRITICAL ADDITIONS START ===== //

// Serve static assets with proper MIME types
app.use('/product/assets', express.static(
  path.join(__dirname, '../frontend/dist/assets'),
  {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.css')) {
        res.set('Content-Type', 'text/css');
      } else if (filePath.endsWith('.js')) {
        res.set('Content-Type', 'application/javascript');
      } else if (filePath.endsWith('.png')) {
        res.set('Content-Type', 'image/png');
      } else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
        res.set('Content-Type', 'image/jpeg');
      } else if (filePath.endsWith('.svg')) {
        res.set('Content-Type', 'image/svg+xml');
      }
    },
    maxAge: '1y', // Cache for 1 year
    immutable: true // For cache-busted files
  }
));

// Serve index.html for all other routes (SPA fallback)
app.get(/^(?!\/?api).*/, (req, res) => { // Exclude /api routes
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// ===== CRITICAL ADDITIONS END ===== //

// API Routes
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});









// // server.js
// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import connectCloudinary from './config/cloudinary.js';
// import connectDB from './config/mongodb.js';
// import userRouter from './routes/userRoute.js';
// import productRouter from './routes/productRoute.js';
// import cartRouter from './routes/cartRoute.js';
// import orderRouter from './routes/orderRoute.js';
// import subscriptionRouter from './routes/susubscriptionRoute.js';
// import wishlistRouter from './routes/wishlistRoute.js';
// import dashboardRouter from './routes/dashboardRoute.js';
// import skuRouter from './routes/skuRoute.js';
// import reviewRouter from './routes/reviewRoutes.js';


// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Connect to DB and Cloudinary
// connectDB();
// connectCloudinary();

// // Middlewares
// app.use(express.json());




// const allowedOrigins = [
//   'http://localhost:5173',  // frontend local
//   'http://localhost:5174',  // admin local
//   'https://trends-wear.onrender.com',  // deployed frontend
//   'https://mens-wear-admin.onrender.com'  // deployed admin
// ];

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true
// }));


// // Routes
// app.use('/api/user', userRouter);
// app.use('/api/product', productRouter);
// app.use('/api/cart', cartRouter);
// app.use('/api/order', orderRouter);
// app.use('/api/subscribe', subscriptionRouter);
// app.use('/api/wishlist', wishlistRouter);
// app.use("/api/dashboard", dashboardRouter);
// app.use('/api/sku', skuRouter);
// app.use("/api/reviews", reviewRouter);




// // Default route
// app.get('/', (req, res) => {
//   res.send('API working Mohamed');
// });

// // Start server
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });












































