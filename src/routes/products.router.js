import { Router } from "express";
import ProductController from "../controllers/products.controller.js";

const router = Router();
const productController = new ProductController();

router.get("/", productController.getProducts);
router.post("/", productController.addProduct);
router.get("/:pid", productController.getProductById);
router.post("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

export default router