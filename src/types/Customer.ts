// src/types/Customer.ts
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
  createdAt: Date;
  updatedAt: Date;
}
