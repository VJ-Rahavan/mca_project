import CartModel from '../models/cartModel.js';
import ProductsModel from '../models/productsModel.js';

// Add item to cart
export const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const product = await ProductsModel.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        let cart = await CartModel.findOne({ user: userId });

        if (!cart) {
            cart = new CartModel({
                user: userId,
                items: [{ product: productId, quantity }],
                totalAmount: product.price * quantity,
            });
        } else {
            const existingItem = cart.items.find(item => item.product.toString() === productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            cart.totalAmount += product.price * quantity;
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Failed to add to cart', error: err.message });
    }
};

// Get cart for user
export const getCart = async (req, res) => {
    const { userId } = req.query;

    try {
        const cart = await CartModel.findOne({ user: userId }).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'CartModel not found' });

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
    }
};

// Update cart item quantity
export const updateCart = async (req, res) => {
    const { userId, quantity } = req.body;
    const { itemId } = req.params;

    try {
        const cart = await CartModel.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'CartModel not found' });

        const item = cart.items.id(itemId);
        if (!item) return res.status(404).json({ message: 'Item not found in cart' });

        const product = await ProductsModel.findById(item.product);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Adjust totalAmount
        cart.totalAmount -= product.price * item.quantity;
        item.quantity = quantity;
        cart.totalAmount += product.price * quantity;

        await cart.save();
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update cart', error: err.message });
    }
};

// Delete item from cart
export const deleteFromCart = async (req, res) => {
    const { userId } = req.query;
    const { itemId } = req.params;

    try {
        const cart = await CartModel.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'CartModel not found' });

        const item = cart.items.id(itemId);
        if (!item) return res.status(404).json({ message: 'Item not found in cart' });

        const product = await ProductsModel.findById(item.product);
        if (product) {
            cart.totalAmount -= product.price * item.quantity;
        }

        item.remove();
        await cart.save();

        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete item from cart', error: err.message });
    }
};

// Clear entire cart
export const clearCart = async (req, res) => {
    const { userId } = req.query;

    try {
        const cart = await CartModel.findOne({ user: userId });
        if (!cart) return res.status(404).json({ message: 'CartModel not found' });

        cart.items = [];
        cart.totalAmount = 0;
        await cart.save();

        res.status(200).json({ message: 'CartModel cleared successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to clear cart', error: err.message });
    }
};
