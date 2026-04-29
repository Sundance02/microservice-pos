import express, {type Router} from 'express'
import {RegisterSchema, LoginSchema} from '../zodSchema.js'
import {zodValidate} from '../middlewares/zodValidate.js'
import UserController from '../controller/controller.js'

const router: Router = express.Router()
router.post('/api/v1/register', zodValidate(RegisterSchema), UserController.Register)
router.post('/api/v1/login', zodValidate(LoginSchema), UserController.Login)
export default router