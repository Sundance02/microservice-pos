import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express';

class Authen {
    public isAuthen = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]
            console.log(token) //token เข้าปกติ
            if (!token) {
                return res.status(400).json({
                    success: false,
                    message: 'No token provided'
                })
            }
            const secret = process.env.SECRETKEY || ''
            console.log(secret)
            const verify = jwt.verify(token, secret)

            next();
        } catch (error) {
            console.log(error)
            return res.status(400).json({
                success: false,
                message: 'Token is expired or invalid'
            })
        }
    }
}

export default new Authen();