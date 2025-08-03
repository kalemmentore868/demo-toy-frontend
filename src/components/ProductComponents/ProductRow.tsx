// src/components/ProductComponents/ProductRow.tsx
import { Link } from "react-router-dom";
import type { Product } from "@/types/Products";
import { Button } from "@/components/ui/button";

interface ProductRowProps {
  product: Product;
}

export function ProductRow({ product }: ProductRowProps) {
  return (
    <tr>
      {/* Name */}
      <td className="px-4 py-2">
        <div className="font-medium">{product.name}</div>
      </td>

      {/* Description (truncate) */}
      <td className="px-4 py-2 hidden md:table-cell">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description ?? "—"}
        </p>
      </td>

      {/* Category */}
      <td className="px-4 py-2 text-sm text-secondary-foreground capitalize">
        {product.category.replace("_", " ")}
      </td>

      {/* Price */}
      <td className="px-4 py-2 font-semibold">${product.price}</td>

      {/* Actions */}
      <td className="px-4 py-2 text-right">
        <Link to={`/products/edit/${product.id}`}>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </Link>
      </td>
    </tr>
  );
}
