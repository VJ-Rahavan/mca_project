import mongoose from 'mongoose'
import ProductsModel from "../models/productsModel.js"

// @desc   Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductsModel.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products', details: error.message });
    }
};

// @desc   Get a single product by ID
export const getSingleProduct = async (req, res) => {
    try {
        const product = await ProductsModel.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product', details: error.message });
    }
};

// @desc   Create a new product
export const createNewProduct = async (req, res) => {
    try {
        const product = new ProductsModel(req.body);
        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create product', details: error.message });
    }
};

// @desc   Update a product
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await ProductsModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update product', details: error.message });
    }
};

// @desc   Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await ProductsModel.findByIdAndDelete(req.params.id);
        if (!deletedProduct) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product', details: error.message });
    }
};

// @desc   Get products by price range (?min=100&max=1000)
export const getProductsByPriceRange = async (req, res) => {
    const { min = 0, max = Infinity } = req.query;

    try {
        const products = await ProductsModel.find({
            price: { $gte: Number(min), $lte: Number(max) }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to filter by price range', details: error.message });
    }
};

// @desc   Get products by category (?category=shoes)
export const getProductsByCategory = async (req, res) => {
    const { category } = req.query;

    try {
        const products = await ProductsModel.find({
            tags: { $in: [category] }
        });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to filter by category', details: error.message });
    }
};
