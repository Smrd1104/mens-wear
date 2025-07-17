import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
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
// ===== Enhanced Static File Handling ===== //
const frontendPath = path.join(__dirname, '../dist');


// / Verify build exists
if (!fs.existsSync(frontendPath)) {
  console.error('Frontend build not found at:', frontendPath);
  console.error('Please run "npm run build" in the frontend directory');
  process.exit(1);
}
// Serve static assets
app.use('/product/assets', express.static(
  path.join(frontendPath, 'assets'),
  {
    setHeaders: (res, filePath) => {
      const mimeTypes = {
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      };
      const ext = path.extname(filePath);
      if (mimeTypes[ext]) res.set('Content-Type', mimeTypes[ext]);
    },
    maxAge: '1y',
    immutable: true
  }
));


// Debug endpoint to verify paths
app.get('/path-info', (req, res) => {
  res.json({
    frontendPath,
    exists: fs.existsSync(frontendPath),
    contents: fs.readdirSync(frontendPath),
    env: process.env.NODE_ENV
  });
});

// SPA Fallback (excludes API routes)
app.get(/^(?!\/?api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
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












































