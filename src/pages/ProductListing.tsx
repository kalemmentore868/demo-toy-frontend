import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { Layout } from "@/components/Layout";
import { LoadingPage } from "@/components/Loader";
import { ErrorPage } from "@/components/ErrorComponent";
import { ProductRow } from "@/components/ProductComponents/ProductRow";
import { Button } from "@/components/ui/button";

export default function ProductsList() {
  const { data: products, isLoading, isError, error, refetch } = useProducts();

  if (isLoading) return <LoadingPage />;
  if (isError)
    return <ErrorPage message={error.message} onRetry={() => refetch()} />;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link to="/products/new">
          <Button variant="success">Create New Product</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left hidden md:table-cell">
                Description
              </th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products!.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
