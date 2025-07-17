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
// Dynamic path resolution for different environments
const getFrontendPath = () => {
  // Try Render.com path first
  const renderPath = path.join(__dirname, '../../frontend/dist');
  if (fs.existsSync(renderPath)) return renderPath;
  
  // Fallback to local development path
  const localPath = path.join(__dirname, '../frontend/dist');
  if (fs.existsSync(localPath)) return localPath;
  
  throw new Error('Frontend build not found');
};

const frontendPath = getFrontendPath();
// Serve static assets with proper MIME types
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
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2'
      };
      const ext = path.extname(filePath);
      if (mimeTypes[ext]) res.set('Content-Type', mimeTypes[ext]);
    },
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : '0',
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
  const indexPath = path.join(frontendPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    return res.status(500).send('Frontend build not found');
  }
  res.sendFile(indexPath);
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












































