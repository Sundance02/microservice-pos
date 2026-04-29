import express, { type Router } from "express"
import ProductController from "../controller/controller.js";
import { zodValidate } from "../middlewares/zodValidate.js";
import { CreateProductSchema, ManageInventory } from "../zodSchema.js"

const router:Router = express.Router()

router.get('/api/v1/products', ProductController.getProducts);
router.get('/api/v1/products/bulk', ProductController.checkStok);
router.get('/api/v1/product/:id', ProductController.getProduct);
router.post('/api/v1/product', zodValidate(CreateProductSchema), ProductController.createProduct);
router.post('/api/v1/inventories', zodValidate(ManageInventory), ProductController.manageInventory);

export default router