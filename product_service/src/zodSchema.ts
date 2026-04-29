import { z } from "zod"
import { Type } from "@prisma/client"

export const CreateProductSchema = z.object({
    category_id: z.int(),
    name: z.string(),
    description: z.string(),
    unitprice: z.int(),
    quantity: z.int(),
})

export const InventoryItem = z.object({
    inventory_id: z.int(),
    type: z.enum(Type),
    quantityChange: z.int()
})

export const ManageInventory = z.object({
    items: z.array(
        InventoryItem
    )
})

export const ManageInventoryDB = z.array(
        InventoryItem
    )