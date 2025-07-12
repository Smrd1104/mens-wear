import express from 'express';
import { createSKU, getSKUsByProduct, updateSKU, deleteSKU } from '../controllers/skuController.js';
import adminAuth from '../middleware/adminAuth.js';

const skuRouter = express.Router();

// Create SKU (Admin only)
skuRouter.post('/create', adminAuth, createSKU);

// Get all SKUs by productId
skuRouter.get('/:productId', getSKUsByProduct);

// Update SKU (Admin only)
skuRouter.put('/update', adminAuth, updateSKU);

// Delete SKU (Admin only)
skuRouter.delete('/:skuCode', adminAuth, deleteSKU);

export default skuRouter;
