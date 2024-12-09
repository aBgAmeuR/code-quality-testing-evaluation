import express, { Request, Response, NextFunction } from "express";
import * as productController from "../controllers/productController";
import auth from "../middleware/auth";

const router = express.Router();

router.get("/products", auth, productController.getAllProducts);
router.post("/products", auth, productController.createProduct);
router.get("/products/:id", auth, productController.getProduct);
router.patch("/products/:id/stock", auth, productController.updateStock);

export default router;
