import { Router } from "express";
import passport from "passport";

import CartController from "../controllers/carts.controller.js";
import TicketController from "../controllers/tickets.controller.js";

const router = Router();
const cartController = new CartController();
const ticketController = new TicketController();

router.get("/", cartController.getCarts)
router.post("/", passport.authenticate("current", {session: false}), cartController.addCart);

router.get("/:cid", cartController.getCartById);
router.put("/:cid", cartController.updateCart);
router.delete("/:cid", cartController.deleteCart);

router.post('/create_preference', ticketController.mercadoPago);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete("/:cid/product/:pid", cartController.deleteProduct);
router.put("/:cid/product/:pid", cartController.updateProduct);

router.get("/:cid/purchase", passport.authenticate("current", {session: false}), ticketController.generateTicket);

export default router