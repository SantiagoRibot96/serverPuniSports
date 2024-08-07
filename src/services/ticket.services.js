import { TicketModel } from "../models/ticket.model.js";
import { generateCode } from "../utils/functions.js";

class TicketService {
    async deleteTicket(tid) {
        try {
            const deletedTicket = await TicketModel.findByIdAndDelete(tid);

            return deletedTicket;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async generateTicket(cart) {
        try {
            if(cart.products[0] != null){
                const amount = cart.products.reduce((total, item) => total + item.product.price*item.quantity, 0);

                let newTicket = new TicketModel ({
                    code: generateCode(15),
                    purchase_datetime: Date.now(), 
                    amount, 
                    purchaser: cart.user
                });

                await newTicket.save();
                return newTicket;
            }else{
                throw new Error(`No hay productos con suficiente stock en el carrito`);
            }
        } catch (error) {
            throw new Error(`${error}`);
        }
    }

    async getTickets() {
        try {
            const tickets = await TicketModel.find();
            
            return tickets;
        } catch (error) {
            throw new Error(`${error}`);
        }
    }
}

export default TicketService;