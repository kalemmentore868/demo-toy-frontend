// src/components/CustomerRow.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Edit } from "lucide-react";
import type { Customer } from "@/types/Customer";

interface CustomerRowProps {
  customer: Customer;
}

export function CustomerRow({ customer }: CustomerRowProps) {
  return (
    <tr className="border-b last:border-none hover:bg-accent/5 w-[100%] text-sm">
      {/* Name */}
      <td className="px-4 py-2 ">{customer.name}</td>

      {/* Email */}
      <td className="px-4 py-2">{customer.email}</td>

      {/* Phone (hide on xs) */}
      <td className="px-4 py-2  hidden sm:table-cell">
        {customer.phone ?? "—"}
      </td>

      {/* Country (hide on sm) */}
      <td className="px-4 py-2  hidden md:table-cell">
        {customer.country ?? "—"}
      </td>

      {/* Actions */}
      <td className="px-4 py-2  text-left flex items-center gap-2">
        <Link to={`/customers/${customer.id}`}>
          <Button variant="default" className="p-2 me-3">
            <Eye className="w-4 h-4" /> View
          </Button>
        </Link>
        <Link to={`/customers/edit/${customer.id}`}>
          <Button variant="outline" className="p-2">
            <Edit className="w-4 h-4" /> Edit
          </Button>
        </Link>
      </td>
    </tr>
  );
}
