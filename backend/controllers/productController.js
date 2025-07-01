

// add product 

import productModel from "../models/productModel.js";

const addProduct = async (req, res) => {
    try {
        // Handle potential trailing spaces in field names
        const { 
            name, 
            'description ': descriptionWithSpace, 
            price, 
            category, 
            'subCategory ': subCategoryWithSpace, 
            sizes, 
            bestseller 
        } = req.body;

        // Use the correct field names (trimming spaces if needed)
        const description = descriptionWithSpace || req.body.description;
        const subCategory = subCategoryWithSpace || req.body.subCategory;

        if (!description || !subCategory) {
            return res.status(400).json({
                success: false,
                message: "Description and subCategory are required"
            });
        }

        // Convert data types
        const numericPrice = Number(price);
        const isBestseller = bestseller === 'true';
        const sizesArray = JSON.parse(sizes);
        
        // Handle images
        const images = [];
        for (let i = 1; i <= 4; i++) {
            if (req.files[`image${i}`] && req.files[`image${i}`][0]) {
                images.push(req.files[`image${i}`][0].path);
            }
        }

        // Create new product
        const newProduct = new productModel({
            name,
            description,
            price: numericPrice,
            image: images,
            category,
            subCategory,
            sizes: sizesArray,
            bestseller: isBestseller,
            date: Date.now()
        });

        await newProduct.save();

        res.json({ 
            success: true, 
            message: "Product added successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

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