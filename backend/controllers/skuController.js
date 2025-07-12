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

    res.status(200).json({ success: true, data: skus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE a SKU (admin)
export const updateSKU = async (req, res) => {
  try {
    const { skuCode, quantityAvailable, quantityReserved } = req.body;

    const updatedSKU = await skuModel.findOneAndUpdate(
      { skuCode },
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
