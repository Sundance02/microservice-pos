import { z } from "zod"

export const OrderSchema = z.object(
        {
            customer_id: z.int(),
            items: z.array(
                z.object({
                    product_id: z.int(),
                    quantity: z.int()
                })
            )
        }
    )

export type OrderData = z.infer<typeof OrderSchema>;

export const CreateOrderSchema = z.object({
    order: OrderSchema
})

export const InventoryItemSchema = z.object({
    inventory_id: z.int(),
    type: z.enum(["Restock",
        "Sale",
        "Return",
        "Reserve"]),
    quantityChange: z.int()
})

export const InventoryItemArraySchema = z.array(
    InventoryItemSchema
)
