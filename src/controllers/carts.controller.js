import CartService from "../services/carts.services.js";

const cartService = new CartService();

class CartController {
    async getCarts(req, res, next) {
        try {
            const carts = await cartService.getCarts();

            req.logger.info(`Carts obtenidos: ${carts}`)
            res.status(200).send({ok: true, message: "Carts obtenidos con exito", payload: carts});
        } catch (error) {
            next(error);
        }
    }

    async addCart(req, res, next) {
        try {
            const user = req.user.email;
            const newCart = await cartService.addCart(user);

            req.logger.info(`Cart creado: ${newCart}`);
            res.status(200).send({ok: true, message: "Cart creado con exito", payload: newCart});
        } catch (error) {
            next(error);
        }
    }

    async getCartById(req, res, next) {
        try {
            const cid = req.params.cid;
            // const rol = req.user.rol === "admin" ? 1 : 0;
            const cart = await cartService.getCartById(cid);
        
            const products = cart.products.map(item => ({
                product: item.product.toObject(),
                quantity: item.quantity
            }));

            req.logger.info(`Cart obtenido: ${cart}`);
            res.status(200).send({ok: true, message: "Cart obtenido con exito", payload: products});
            // res.render("carts", {cid, rol, productos: products, userName: req.user.first_name});
        } catch (error) {
            next(error);
        }
    }

    async addProductToCart(req, res, next) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const quantity = req.body.quantity || 1;

            const cart = await cartService.addProductToCart(cid, pid, quantity);

            req.logger.info(`Cart actualizado: ${cart}`);
            res.status(200).send({ok: true, message: "Producto agregado al cart con exito", payload: cart});
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
        
            const cart = await cartService.deleteProduct(cid, pid);

            req.logger.info(`Producto eliminado del Cart: ${cart}`);
            res.status(200).send({ok: true, message: "Producto eliminado del cart con exito", payload: cart});
        } catch (error) {
            next(error);
        }
    }

    async updateCart(req, res, next){
        try {
            const cid = req.params.cid;
            const updatedProducts = req.body;

            const updatedCart = await cartService.updateCart(cid, updatedProducts);
            
            req.logger.info(`Cart actualizado: ${updatedCart}`);
            res.status(200).send({ok: true, message: "Cart actualizado con exito", payload: updatedCart});
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next){
        try {
            const cid = req.params.cid;
            const pid = req.params.pid;
            const newQuantity = req.body.quantity;

            const updatedCart = await cartService.updateProduct(cid, pid, newQuantity);
            
            req.logger.info(`Cart actualizado: ${updatedCart}`);
            res.status(200).send({ok: true, message: "Producto actualizado en el cart con exito", payload: updatedCart});
        } catch (error) {
            next(error);
        }
    }

    async deleteCart(req, res, next){
        try {
            const cid = req.params.cid;
            const deletedCart = await cartService.deleteCart(cid);

            req.logger.info(`El carrito ha sido eliminado: ${deletedCart}`);
            res.status(200).send({ok: true, message: "Cart eliminado con exito", payload: deletedCart});
        } catch (error) {
            next(error);
        }
    }
}

export default CartController;