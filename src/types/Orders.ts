export interface Order {
  id: string;
  customerId: string;
  orderDate: Date;
  status: "pending" | "shipped" | "delivered" | "cancelled"; // adjust to your OrderStatus enum/type if you have one
  totalAmount: string; // Drizzle returns NUMERIC as string
  createdAt: Date;
  updatedAt: Date;
  scheduledDeliveryDate: Date;
  dateDelivered: Date | null;
  deliveryStreet: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryPostal: string;
  deliveryCountry: string;
}

// And for inserts, omit auto-generated fields:
export interface NewOrder {
  customerId: string;
  orderDate?: Date; // defaults to NOW()
  status: string;
  totalAmount: string;
  scheduledDeliveryDate?: Date; // defaults to NOW()+14d
  dateDelivered?: Date; // defaults to NOW()+16d
  deliveryStreet?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryPostal?: string;
  deliveryCountry?: string;
}

// src/types/OrderItem.ts

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: string; // NUMERIC comes back as string
  totalPrice: string; // NUMERIC comes back as string
}

export type PopulatedOrderItem = OrderItem & {
  productName: string;
};

// For inserts (omit auto‐generated PK):
export type NewOrderItem = Omit<OrderItem, "id">;

export interface OrderAndItems {
  order: Order;
  items: PopulatedOrderItem[];
}
