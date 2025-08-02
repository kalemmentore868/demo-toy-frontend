export interface OrderByDay {
  day: string; // e.g. "2025-07-31"
  count: number; // number of orders on that day
}

export interface LocationData {
  country: string; // e.g. "US", "CA", etc.
  count: number; // number of orders delivered to that country
}

export interface CategoryDistribution {
  category: string; // e.g. "Toy Cars", "Dolls", etc.
  count: number; // sum of quantities sold in that category
}

// Top‐level data payload
export interface DashboardData {
  totalCustomers: number;
  ordersByDay: OrderByDay[];
  locationData: LocationData[];
  typeDistribution: CategoryDistribution[];
}
