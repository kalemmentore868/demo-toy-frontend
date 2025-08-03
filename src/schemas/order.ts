// src/schemas/orderForm.ts
import { z } from "zod";

export const orderItemSchema = z.object({
  productId: z.string().min(1, "Select a product"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});
export const orderSchema = z.object({
  orderDate: z.string().optional(),
  scheduledDeliveryDate: z.string().optional(),
  dateDelivered: z.string().optional(),
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]),
  deliveryStreet: z.string().min(1),
  deliveryCity: z.string().min(1),
  deliveryState: z.string().optional(),
  deliveryPostal: z.string().optional(),
  deliveryCountry: z.string().min(1),
  items: z.array(orderItemSchema).min(1),
});
export type OrderFormValues = z.infer<typeof orderSchema>;

export type NewOrderSchema = OrderFormValues & {
  customerId: string;
  totalAmount: string;
};
