// src/components/CustomerOrders.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import OrderService from "@/services/OrderService";
import type { Order } from "@/types/Orders";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { OrderRow } from "../OrderComponents/OrderRow";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

interface CustomerOrdersProps {
  customerId: string;
}

export function CustomerOrders({ customerId }: CustomerOrdersProps) {
  const { user } = useAuth();

  const {
    data: orders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Order[], Error>({
    queryKey: ["orders", customerId],
    enabled: !!user,
    queryFn: () =>
      OrderService.list(customerId, user!.token).then((res) => res.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-destructive">
        Error loading orders: {error.message}
        <button className="ml-4 underline" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Customer Orders</CardTitle>

        <Link to={`/customers/${customerId}/orders/new`}>
          <Button variant={"success"}>Create Order</Button>
        </Link>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {orders.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            No orders found for this customer.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Order Date</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left hidden sm:table-cell">
                    Scheduled Delivery
                  </th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    customerId={customerId}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
