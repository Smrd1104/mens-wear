import skuModel from '../models/skuModel.js';

// CREATE a new SKU (admin use)
export const createSKU = async (req, res) => {
  try {
    const { productId, size, color, quantityAvailable = 0, quantityReserved = 0 } = req.body;

    const skuCode = `${productId}-${size}-${color}`;

    const newSKU = await skuModel.create({ productId, skuCode, size, color, quantityAvailable, quantityReserved });

    res.status(200).json({ success: true, message: 'SKU created successfully', data: newSKU });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET all SKUs for a product
export const getSKUsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const skus = await skuModel.find({ productId });

    return res.status(200).json({
      success: true,
      data: skus || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// UPDATE a SKU (admin)
export const updateSKU = async (req, res) => {
  try {
    const { skuId } = req.params;
    const { quantityAvailable, quantityReserved } = req.body;

    const updatedSKU = await skuModel.findByIdAndUpdate(
      skuId,
      { quantityAvailable, quantityReserved },
      { new: true }
    );

    if (!updatedSKU) {
      return res.status(404).json({ success: false, message: 'SKU not found' });
    }

    res.status(200).json({ success: true, message: 'SKU updated', data: updatedSKU });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a SKU
export const deleteSKU = async (req, res) => {
  try {
    const { skuCode } = req.params;

    const deleted = await skuModel.findOneAndDelete({ skuCode });

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'SKU not found' });
    }

    res.status(200).json({ success: true, message: 'SKU deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// REDUCE SKU quantity after successful payment
export const reduceSKUQuantities = async (req, res) => {
  try {
    const { items } = req.body;
    // items = [{ skuCode: "productId-size-color", quantity: 2 }, ...]

    const updatedSKUs = [];

    for (const { skuCode, quantity } of items) {
      const sku = await skuModel.findOne({ skuCode });

      if (!sku) {
        return res.status(404).json({ success: false, message: `SKU not found: ${skuCode}` });
      }

      if (sku.quantityAvailable < quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for SKU: ${skuCode}` });
      }

      sku.quantityAvailable -= quantity;

      if (sku.quantityReserved >= quantity) {
        sku.quantityReserved -= quantity;
      }

      await sku.save();
      updatedSKUs.push(sku);
    }

    res.status(200).json({ success: true, message: "Stock reduced", data: updatedSKUs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


