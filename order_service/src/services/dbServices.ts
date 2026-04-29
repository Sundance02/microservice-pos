import prisma from "../services/prisma.js"
import type { Order, OrderItem } from "@prisma/client"
import type { CreateOrderInput } from "../types/types.js"

type OrderItemInput = CreateOrderInput['items'][number];
class DBPrismaService {
    public async getOrders(): Promise<Order[]> {
        try {
            const orders = await prisma.order.findMany()
            return orders
        } catch (error) {
            this.logError(error)
            throw error
        }
    }
    
    public async transaction(data: CreateOrderInput): Promise<void> {
        try {
            await prisma.$transaction(async (prisma) => {

                const order = await prisma.order.create({
                    data: {
                        customer_id: data.customer_id,
                        total_price: data.total_price
                    }
                })
                const orderItem = data.items.map((item: OrderItemInput) => { 
                    const {total_price, ...rest} = item
                    return { ...rest, order_id: order.id }
                })
                await prisma.orderItem.createMany({
                    data: orderItem
                })

                console.log('created', order)
            }
            )
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

export default new DBPrismaService();