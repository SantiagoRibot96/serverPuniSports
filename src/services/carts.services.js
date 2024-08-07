import { CartModel } from "../models/cart.model.js";
import { CustomError } from "./errors/custom-error.js";
import { EErrors } from "./errors/enum.js";
import { getErrorInfo } from "./errors/info.js";
import ProductService from "./products.services.js";

const productService = new ProductService();

class CartService {
    async getCarts() {
        try {
            const carts = await CartModel.find();

            if(!carts){
                throw CustomError.createError({
                    name: "Carritos no encontrados",
                    source: getErrorInfo({}, 5),
                    message: "Error al obtener los carritos",
                    code: EErrors.DB_ERROR
                });
            }
            
            return carts;
        } catch (error) {
            throw error;
        }
    }

    async addCart(user) {
        try {
            const newCart = new CartModel({products: [], user});

            if(!newCart){
                throw CustomError.createError({
                    name: "Carrito no creado",
                    source: getErrorInfo({}, 5),
                    message: "Error al crear un carrito",
                    code: EErrors.DB_ERROR
                });
            }

            await newCart.save();

            return newCart;
        } catch (error) {
            throw error;
        }
    }

    async getCartById(cid) {
        try {
            const cart = await CartModel.findById(cid);

            if(!cart){
                throw CustomError.createError({
                    name: "Carrito no encontrado",
                    source: getErrorInfo({cid}, 6),
                    message: "Error al obtener el carrito",
                    code: EErrors.NOT_FOUND
                });
            }

            return cart;
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cid, pid, quantity = 1) {
        try {
            const cart = await this.getCartById(cid);
            const existeProducto = cart.products.find(item => item.product._id.toString() === pid);
            const product = await productService.getProductById(pid);
            let newQuantity;

            existeProducto === undefined ? newQuantity = 0 : newQuantity = existeProducto.quantity

            if(newQuantity + quantity <= product.stock){
                if(existeProducto){
                    existeProducto.quantity += quantity;
                }else{
                    cart.products.push({ product: pid, quantity});
                }

                cart.markModified("products");
                await cart.save();
            }else{
                throw CustomError.createError({
                    name: "No hay suficiente stock del producto",
                    source: getErrorInfo({cid}, 6),
                    message: "Error al agregar productos el carrito",
                    code: EErrors.NOT_FOUND
                });
            }

            return cart;
        } catch (error) {
            throw error;
        }
    }

    async deleteProduct(cid, pid) {
        try {
            const cart = await this.getCartById(cid);

            const existeProducto = cart.products.findIndex(item => item.product._id.toString() === pid);

            if(existeProducto != -1) cart.products.splice(existeProducto, 1)
            else {
                throw CustomError.createError({
                    name: "Producto no encontrado",
                    source: getErrorInfo({title: "", _id: pid}, 3),
                    message: "Error al obtener los carritos",
                    code: EErrors.DB_ERROR
                });
            };
            
            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateCart(cid, updatedProducts){
        try {
            const cart = await this.getCartById(cid);

            cart.products = updatedProducts;

            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async updateProduct(cid, pid, newQuantity){
        try {
            const cart = await this.getCartById(cid);

            const productIndex = cart.products.findIndex(item => item.product._id.toString() !== pid);

            cart.products[productIndex].quantity = newQuantity;

            cart.markModified("products");
            await cart.save();
            return cart;
        } catch (error) {
            throw error;
        }
    }

    async deleteCart(cid){
        try {
            const deletedCart = await CartModel.findByIdAndDelete(cid);
            
            if(!deletedCart){
                throw CustomError.createError({
                    name: "Carrito no encontrado",
                    source: getErrorInfo({}, 5),
                    message: "Error al eliminar un carrito",
                    code: EErrors.DB_ERROR
                });
            }

            return deletedCart;
        } catch (error) {
            throw error;
        }
    }
}

export default CartService;