import express, {type Router} from 'express'
import ProxyOptions from '../configs/gatewayConfig.js'
import Authen from "../middlewares/authen.js"
const router:Router = express.Router();

router.use('/product-service', Authen.isAuthen, ProxyOptions.createServiceProxy('http://localhost:3001', '/products-service'));
router.use('/order-service', Authen.isAuthen, ProxyOptions.createServiceProxy('http://localhost:3002', '/orders-service'));

export default router