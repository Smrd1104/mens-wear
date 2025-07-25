// routes/skuRoutes.js

import express from 'express';
import {
  createSKU,
  getSKUsByProduct,
  updateSKU,
  deleteSKU, reduceSKUQuantities
} from '../controllers/skuController.js';
import adminAuth from '../middleware/adminAuth.js';

const skuRouter = express.Router();

// Create a new SKU (Admin only)
skuRouter.post('/create', adminAuth, createSKU);

// Get all SKUs for a specific product
skuRouter.get('/product/:productId', getSKUsByProduct);

// Update SKU details (Admin only)
// Uses skuCode in body
skuRouter.put('/update/:skuId', adminAuth, updateSKU);

// Delete SKU by skuCode (Admin only)
skuRouter.delete('/delete/:skuCode', adminAuth, deleteSKU);

// Reduce quantity after successful payment
skuRouter.post('/reduce-quantity', reduceSKUQuantities); // No adminAuth, called by customer post-payment


export default skuRouter;
