import type { Request, Response } from 'express';
import DBPrismaService from '../services/dbServices.js'
import type { OrderItem } from "@prisma/client"
import Queue from "../services/queue.js"
import type { CreateOrderInput } from "../types/types.js"
import { Prisma } from '@prisma/client';
import type { OrderData } from "../zodSchema.js"
class OrderController {
    public async getOrders(req: Request, res: Response) {
        try {
            const orders = DBPrismaService.getOrders()
            return res.status(200).json({
                orders: orders
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }

    private createOrderData(productItems: { products: OrderItem[] }, order: OrderData): CreateOrderInput {
        type CreateOrderItem = CreateOrderInput['items'][number];
        console.log(productItems, order)
        const items: CreateOrderItem[] = productItems.products.map((item) => {
            const foundItem = order.items.find((orderitem) => {
                return orderitem.product_id === item.id;
            });
            const quantity = foundItem?.quantity ?? 0
            const unitPrice = item.unitprice ?? 0;
            const totalPrice = new Prisma.Decimal(quantity * unitPrice)
            return { quantity: quantity, product_id: item.id, name: item.name, description: item.description, unitprice: item.unitprice, total_price: totalPrice }
        })
        const total_price = items.reduce((sum: number, current) => sum + Number(current.total_price), 0)
        return {
            customer_id: order.customer_id,
            items: items,
            total_price: total_price
        }
    }

    public transaction = async (req: Request, res: Response) => {
        try {
            //1. รับ order มาว่าเอาอะไรบ้าง checked
            //2. เอาข้อมูล order ไปขอข้อมูล product/stock จาก product service checked
            //3. product service ส่งข้อมูลให้ checked
            //4. order service เช็คถ้ามีของก็ส่งข้อมูลกลับมาบอกว่ามีของนะจ๊ะ checked
            //5. product service reserved ของไว้ให้ checked
            //6. (ควรเป็น payment ให้ลูกค้าจ่ายเงินแล้วตัดของ) เราไม่มี payment ก็ยืนยัน order เลย checked
            //7. order บอกให้ product service ตัดของได้เลย (อยากลองใช้ queue) checked
            //8. สร้างข้อมูล order checked

            const { order } = req.body
            const products_id = order.items.map((item: OrderItem) => item.product_id)
            const checkProductResponse = await fetch(`${process.env.PRODUCT_SERVICE}/api/v1/products/bulk?ids=${products_id}`)
            const productItems: { products: OrderItem[] } = await checkProductResponse.json()
            const isEnough = productItems.products.every((product: any) => {
                const orderItems: OrderItem = order.items.find((orderItem: OrderItem) => orderItem.product_id == product.id)
                return product.inventories[0].quantity >= orderItems.quantity
            })

            if (isEnough === false) {
                return res.status(400).json({ message: 'out of stock' })
            }

            const reservedProduct = order.items.map((item: OrderItem) => {
                return { inventory_id: item.product_id, quantityChange: item.quantity, type: "Reserve" }
            })
            const reservedProductResponse = await fetch(`${process.env.PRODUCT_SERVICE}/api/v1/inventories`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ items: reservedProduct })
            })


            //6. (ควรเป็น payment ให้ลูกค้าจ่ายเงินแล้วตัดของ) เราไม่มี payment ก็ยืนยัน order เลย
            const transactionIds = await reservedProductResponse.json()
            const transaction = transactionIds.data.map((id: number) => {
                return { inventory_id: id, type: "Sale" }
            })
            //7. order บอกให้ product service ตัดของได้เลย (อยากลองใช้ queue)
            Queue.sendToQueue(transaction, "Paid")

            //8. สร้างข้อมูล order
            const orderData: CreateOrderInput = this.createOrderData(productItems, order)
            DBPrismaService.transaction(orderData)
            console.log('created order', orderData)
            return res.status(200).json({
                orders: productItems
            })

        } catch (error) {
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Internal Server Error"
            });
        }
    }
}

export default new OrderController();