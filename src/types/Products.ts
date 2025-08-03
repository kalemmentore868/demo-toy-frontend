// src/types/Product.ts

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: string; // NUMERIC comes back as a string
  category: string; // adjust to a more specific union if you have one
  imageUrl: string | null;
  stockQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// For creating new products (omit auto-generated fields):
export type NewProduct = Omit<Product, "id" | "createdAt" | "updatedAt">;
// For updating existing products (all fields except id are optional):
export type UpdateProduct = Partial<
  Omit<Product, "id" | "createdAt" | "updatedAt">
>;
