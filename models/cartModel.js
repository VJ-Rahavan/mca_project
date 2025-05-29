import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'productsModel',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: [1, 'Quantity cannot be less than 1'],
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            enum: ['active', 'completed', 'cancelled'],
            default: 'active',
        },
    },
    { timestamps: true }
);


const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;