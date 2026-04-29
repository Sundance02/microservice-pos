import express, {type Router} from 'express'
import OrderController from '../controller/controller.js'
import {CreateOrderSchema} from '../zodSchema.js'
import {zodValidate} from "../middlewares/zodValidate.js"
const router:Router = express.Router();

router.get('/api/v1/orders', OrderController.getOrders)
router.post('/api/v1/transaction',zodValidate(CreateOrderSchema) , OrderController.transaction)

export default router