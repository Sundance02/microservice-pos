import type { OrderItem, Order } from "@prisma/client"

export type CreateOrderInput = {
    customer_id: number;
    total_price: number;
    items: (Pick<OrderItem, 'product_id' | 'quantity' | 'name' | 'description' | 'unitprice'>&Pick<Order, 'total_price'>)[];
}