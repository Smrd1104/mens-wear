

// add product 
import mongoose from "mongoose";

import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary"


const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      category,
      subCategory,
      sizes,
      bestseller,
      latest,
      colors
    } = req.body;

    // const description = descriptionWithSpace || req.body.description;
    // const subCategory = subCategoryWithSpace || req.body.subCategory;

    if (!name || !description || !price || !discountPrice || !category || !subCategory || !sizes) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const numericPrice = Number(price);
    const discountNumericPrice = Number(discountPrice);

    if (isNaN(numericPrice) || isNaN(discountNumericPrice)) {
      return res.status(400).json({ success: false, message: "Price values must be valid numbers." });
    }

    const isBestseller = bestseller === "true";
    const isLatest = latest === "true"
    const sizesArray = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    const colorsArray = typeof colors === "string" ? JSON.parse(colors) : colors;


    const validHexColor = /^#([0-9A-F]{3}){1,2}$/i;
    const isColorsValid = Array.isArray(colorsArray) && colorsArray.every(color => validHexColor.test(color));

    if (!isColorsValid) {
      return res.status(400).json({ success: false, message: "Invalid color format" });
    }


    // ✅ Upload images to Cloudinary
    const images = [];

    for (let i = 1; i <= 4; i++) {
      const file = req.files?.[`image${i}`]?.[0];
      if (file) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "mens-wear",
        });
        images.push(uploaded.secure_url); // ✅ use cloudinary URL
      }
    }

    const productData = new productModel({
      name,
      description,
      price: numericPrice,
      discountPrice: discountNumericPrice,
      image: images,
      category,
      subCategory,
      sizes: sizesArray,
      colors: colorsArray,
      bestseller: isBestseller,
      latest: isLatest,
      date: Date.now(),
    });

    await productData.save();

    res.json({ success: true, message: "Product added successfully", product: productData });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


const editProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      discountPrice,
      category,
      subCategory,
      sizes,
      bestseller,
      latest,
      colors
    } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    const numericPrice = Number(price);
    const discountNumericPrice = Number(discountPrice);
    const sizesArray = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    const colorsArray = typeof colors === "string" ? JSON.parse(colors) : colors;

    // Upload new images if available
    const images = [];

    for (let i = 1; i <= 4; i++) {
      const file = req.files?.[`image${i}`]?.[0];
      if (file) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "mens-wear",
        });
        images.push(uploaded.secure_url);
      }
    }

    const updatedData = {
      name,
      description,
      price: numericPrice,
      discountPrice: discountNumericPrice,
      category,
      subCategory,
      sizes: sizesArray,
      colors: colorsArray,
      bestseller: bestseller === "true",
      latest: latest === "true",
    };

    // Only update images if new ones were uploaded
    if (images.length > 0) {
      updatedData.image = images;
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, updatedData, { new: true });

    res.json({ success: true, message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("❌ Error editing product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// list product 

const listProducts = async (req, res) => {

  try {

    const products = await productModel.find({});
    res.json({ success: true, products })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }

}

// remove product 


const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;

    // Validate ID format
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing product ID",
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// single product 

const singleProduct = async (req, res) => {

  try {
    const { productId } = req.body
    const product = await productModel.findById(productId)
    res.json({ success: true, product })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }


}


export { addProduct, singleProduct,editProduct, removeProduct, listProducts }