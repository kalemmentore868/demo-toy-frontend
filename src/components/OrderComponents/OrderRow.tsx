// src/components/OrderRow.tsx
"use client";

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import type { Order } from "@/types/Orders";

interface OrderRowProps {
  order: Order;
  customerId: string;
}

export function OrderRow({ order, customerId }: OrderRowProps) {
  const formattedDate = new Date(order.orderDate).toLocaleDateString();
  const formattedTotal = Number(order.totalAmount).toFixed(2);

  return (
    <tr className="border-b last:border-none hover:bg-accent/5">
      {/* Order Date */}
      <td className="px-4 py-2 whitespace-nowrap">{formattedDate}</td>

      {/* Status */}
      <td className="px-4 py-2 whitespace-nowrap capitalize">{order.status}</td>

      {/* Total Amount */}
      <td className="px-4 py-2 whitespace-nowrap">${formattedTotal}</td>

      {/* Scheduled Delivery (hide on small) */}
      <td className="px-4 py-2 whitespace-nowrap hidden sm:table-cell">
        {new Date(order.scheduledDeliveryDate).toLocaleDateString()}
      </td>

      {/* Actions */}
      <td className="px-4 py-2 whitespace-nowrap text-right space-x-2">
        <Link to={`/customers/${customerId}/orders/${order.id}`}>
          <Button variant="default" className="p-2 me-3">
            <Eye className="w-4 h-4" /> View
          </Button>
        </Link>
        <Link to={`/customers/${customerId}/orders/edit/${order.id}`}>
          <Button variant="outline" className="p-2">
            <Edit className="w-4 h-4" /> Edit
          </Button>
        </Link>
      </td>
    </tr>
  );
}
