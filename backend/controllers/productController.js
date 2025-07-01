

// add product 

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

    const newProduct = new productModel({
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

    await newProduct.save();

    res.json({ success: true, message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// list product 

const listProducts = async (req, res) => {

}

// remove product 

const removeProduct = async (req, res) => {

}

// single product 

const singleProduct = async (req, res) => {

}


export { addProduct, singleProduct, removeProduct, listProducts }