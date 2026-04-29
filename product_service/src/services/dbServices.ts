import prisma from '../services/prisma.js';
import type { Product, InventoryTransaction, PrismaPromise } from "@prisma/client";
import { z } from "zod"
import { CreateProductSchema, ManageInventoryDB, InventoryItem } from "../zodSchema.js"

class DBPrismaService {
    public async getProducts(): Promise<Product[]> {
        try {
            const products = await prisma.product.findMany({
                include: {
                    inventories: true,
                }
            })
            return products
        } catch (error) {
            this.logError(error)
            throw error
        }
    }


    public async getProduct(product_id: number): Promise<Product> {
        try {
            const product = await prisma.product.findUniqueOrThrow({
                where: {
                    id: Number(product_id)
                },
                include: {
                    inventories: true,
                }
            })
            return product
        } catch (error) {
            this.logError(error)
            throw error
        }
    }

    public async getSpecificProducts(productIds: number[]): Promise<Product[]> {
        try {
            const products = await prisma.product.findMany({
                include: {
                    inventories: true,
                },
                where: {
                    id: {
                        in: productIds
                    }
                }
            })
            return products
        } catch (error) {
            this.logError(error)
            throw error
        }
    }

    public async insertProduct(product: z.infer<typeof CreateProductSchema>): Promise<void> {
        try {
            const created_product = await prisma.product.create({
                data: {
                    category_id: product.category_id,
                    name: product.name,
                    unitprice: product.unitprice,
                    description: product.description
                }
            })
            const created_inventory = await prisma.inventory.create({
                data: {
                    product_id: created_product.id,
                    quantity: product.quantity
                }
            })
        } catch (error) {
            this.logError(error)
            throw error
        }
    }

    public manageOperation(managedData: z.infer<typeof ManageInventoryDB>): PrismaPromise<any>[] {

        if (!managedData || managedData.length === 0 || !managedData[0]) {
            throw 'no Item';
        }
        const operations: PrismaPromise<any>[] = []
        const transactionType = managedData[0].type

        managedData.forEach((product: z.infer<typeof InventoryItem>) => {
            if (transactionType !== "Sale") { //type sale มาจาก Reserve เท่านั้น
                const createTransactionOperation = prisma.inventoryTransaction.create({
                    data: {
                        inventory_id: Number(product.inventory_id),
                        type: product.type,
                        quantityChange: product.quantityChange
                    }
                })
                operations.push(createTransactionOperation)
            }

            if (transactionType === "Restock") {
                operations.push(
                    prisma.inventory.update({
                        data: {
                            quantity: {
                                increment: product.quantityChange
                            }
                        },
                        where: { id: product.inventory_id }
                    })
                )
            }
            else if (transactionType === "Sale") {
                operations.push(

                    prisma.inventoryTransaction.update({
                        data: {
                            type: "Sale"
                        },
                        where: { id: product.inventory_id }
                    })
                )
            }
            else if (transactionType === "Reserve") {
                operations.push(
                    prisma.inventory.update({
                        data: {
                            quantity: {
                                decrement: product.quantityChange
                            }
                        },
                        where: { id: product.inventory_id }
                    })
                )
            }
        })


        return operations
    }

    public async manageInventory(managedData: z.infer<typeof ManageInventoryDB>): Promise<void | number[]> {
        try {
            // [
            //     { inventory_id: 4, quantityChange: 15, type: 'Reserve' },
            //     { inventory_id: 3, quantityChange: 10, type: 'Reserve' }
            // ]
            if (!managedData || managedData.length === 0 || !managedData[0]) {
                throw 'no Item';
            }
            const operations = this.manageOperation(managedData);
            const transactionData = await prisma.$transaction(operations)
            
            const transactionType = managedData[0].type
            // console.log(transactionType)
            if (transactionType === "Reserve") {
                const transactionIds = transactionData.filter((transaction: InventoryTransaction) => transaction && transaction.type === "Reserve").map(transaction=>transaction.id)
                console.log(transactionType, transactionIds)
                return transactionIds
            }
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