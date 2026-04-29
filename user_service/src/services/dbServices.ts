import prisma from "./prisma.js";
import { z } from "zod"
import { type User } from "@prisma/client"
import type { RegisterSchema } from '../zodSchema.js'
class DBPrismaService {


    public Register = async (data: z.infer<typeof RegisterSchema>) => {
        try {
            const { confirm_password, ...rest } = data
            await prisma.user.create({
                data: rest
            })
        } catch (error) {
            this.logError(error)
            throw error
        }
    }

    public getUser = async (user_name: string): Promise<User | null> => {
        try {
            const data = await prisma.user.findUnique({
                where: {
                    user_name
                }
            })
            return data
        } catch (error) {
            this.logError(error)
            throw error
        }
    }

    public CheckUsername = async (user_name: string) => {
        try {
            const user = await prisma.user.findUnique({
                where: { user_name: user_name },
                select: { id: true }
            })

            return user === null
        } catch (error) {
            this.logError(error)
            throw error
        }
    }

    private logError(error: unknown): void {
        console.log('prisma error')
        console.log(error)
    }
}
export default new DBPrismaService()