import express from "express"
import {
    getAllProducts,
    getSingleProduct,
    createNewProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    getProductsByPriceRange
} from "../controllers/productsController.js"

export const productRouter = express.Router()

productRouter.get('/get-all-products', getAllProducts);
productRouter.get('/products/:id', getSingleProduct);
productRouter.post('/products', createNewProduct);
productRouter.put('/products/:id', updateProduct);
productRouter.delete('/products/:id', deleteProduct);
productRouter.get('/products/price-range', getProductsByPriceRange);
productRouter.get('/products/category', getProductsByCategory);
productRouter.get('/products/search', getAllProducts);

