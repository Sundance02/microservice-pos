import type { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import DBPrismaService from '../services/dbServices.js'
class UserController {

    public Register = async (req: Request, res: Response) => {
        try {
            const { first_name, last_name, user_name, password, confirm_password } = req.body

            const salt = await bcrypt.genSalt(10)
            const hashed_password = await bcrypt.hash(password, salt)
            const check_user_name = await DBPrismaService.CheckUsername(user_name)
            if (!check_user_name) {
                return res.status(400).json({ message: 'this username already exsited' })
            }
            await DBPrismaService.Register({ first_name, last_name, user_name, password: hashed_password, confirm_password })

            return res.status(200).json({ ok: true })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    public Login = async (req: Request, res: Response) => {
        try {
            const {user_name, password} = req.body
            const user = await DBPrismaService.getUser(user_name);
            if(!user){
                return res.status(400).json({message:"user is not found"})
            }
            const is_match = await bcrypt.compare(password, user.password)
            if(!is_match){
                return res.status(400).json({message:"password or username is incorrect"})
            }
            const secret = process.env.SECRETKEY || ''
            const token = jwt.sign({username:user.user_name, role:user.role}, secret, {expiresIn:'1h'})
            return res.status(200).json({token:token})
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
}

export default new UserController();