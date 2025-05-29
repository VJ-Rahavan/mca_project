import express from "express";
import { addToCart, getCart, clearCart, deleteFromCart, updateCart } from "../controllers/cartController.js";
export const cartRouter = express.Router();


cartRouter.post('/cart', addToCart);
cartRouter.get('/cart', getCart);
cartRouter.put('/cart/:itemId', updateCart);
cartRouter.delete('/cart/:itemId', deleteFromCart);
cartRouter.delete('/cart', clearCart);
