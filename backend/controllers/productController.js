

// add product 
import mongoose from "mongoose";

import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary"


const addProduct = async (req, res) => {
  try {
    const {
      name,
      'description ': descriptionWithSpace,
      price,
      category,
      'subCategory ': subCategoryWithSpace,
      sizes,
      bestseller,
    } = req.body;

    const description = descriptionWithSpace || req.body.description;
    const subCategory = subCategoryWithSpace || req.body.subCategory;

    if (!name || !description || !price || !category || !subCategory || !sizes) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const numericPrice = Number(price);
    const isBestseller = bestseller === "true";
    const sizesArray = typeof sizes === "string" ? JSON.parse(sizes) : sizes;

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
      image: images,
      category,
      subCategory,
      sizes: sizesArray,
      bestseller: isBestseller,
      date: Date.now(),
    });

    await productData.save();

    res.json({ success: true, message: "Product added successfully", product: productData });
  } catch (error) {
    console.error("❌ Error adding product:", error);
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


export { addProduct, singleProduct, removeProduct, listProducts }