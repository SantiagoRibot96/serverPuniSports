import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products",
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    user: {
        type: String,
        required: true
    }
});

cartSchema.pre("findOne", function (next) {
    this.populate("products.product", "_id title price thumbnail");
    next();
});

export const CartModel = mongoose.model("carts", cartSchema);