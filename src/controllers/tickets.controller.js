import TicketService from "../services/ticket.services.js";
import CartService from "../services/carts.services.js";
import ProductService from "../services/products.services.js";
import EmailManager from "../services/emails.services.js";

const emailManager = new EmailManager();
const ticketService = new TicketService();
const cartService = new CartService();
const productService = new ProductService();

class TicketController {
    async mercadoPago(req, res) {
        // try {
        //     const products = req.body.products;
        //     console.log(products);
        //     res.status(200);
        // } catch (error) {
        //     console.log(error);
        //     res.status(500)
        // }
        console.log("hola");
    }

    async deleteTicket(req, res) {
        try {
            const tid = req.params.tid;
            const deletedTicket = await cartService.deleteCart(tid);

            req.logger.info(`El ticket ha sido eliminado: ${deletedTicket}`);
            res.status(200).send({ok: true, message: "Ticket eliminado", payload: deletedTicket});
        } catch (error) {
            req.logger.error(`No se pudo eliminar el Ticket: ${error}`)
            res.status(500).send(`No se pudo eliminar el Ticket: ${error}`);
        }
    }

    async generateTicket(req, res) {
        const user = req.user;
        try {
            const cid = req.params.cid;
            const cartSource = await cartService.getCartById(cid);
            const cart = await cartService.getCartById(cid);
            let cartNew = [];
            let flag = false;
            let index = 0;

            for (const item of cartSource.products) {
                const product = await productService.getProductById(item.product._id);

                if (product.stock < item.quantity) {
                    cartNew.push(...cart.products.splice(index, 1));
                    if(index != 0) index++;
                    flag = true;
                }else{
                    product.stock -= item.quantity;
                    await productService.updateProduct(item.product._id, product);
                    index++;
                }
            }

            await cartService.updateCart(cid, cartNew);
            const ticket = await ticketService.generateTicket(cart);
            await emailManager.enviarCorreoCompra(user.email, user.first_name, ticket);

            const message = `Ticket creado codigo: ${ticket.code} ${!flag ? "." : "Hay productos que no pudieron ser agregados"}`;

            req.logger.info(message);
            res.status(200).send({ok: true, message, payload: {ticket, cart}, flag});
        } catch (error) {
            req.logger.error(`Error al generar los Tickets: ${error}`);
            res.status(500).send({ok: false, message: `Error al generar los Tickets: ${error}`});
        }
    }

    async getTickets(req, res) {
        try {
            const tickets = await ticketService.getTickets();

            req.logger.info(`Ticket creado: ${tickets}`);
            res.status(200).send({ok: true, message: "Tickets obtenidos", payload: tickets});
        } catch (error) {
            req.logger.error(`Error al obtener los Tickets: ${error}`);
            res.status(500).send(`Error al obtener los Tickets: ${error}`);
        }
    }
}

export default TicketController;