import { Layout } from "@/components/Layout";
import { LoadingPage } from "@/components/Loader";
import { ErrorPage } from "@/components/ErrorComponent";
import { OrderRow } from "@/components/OrderComponents/OrderRow";
import { useOrders } from "@/hooks/useOrders";

export default function OrdersList() {
  const { data: orders, isLoading, isError, error, refetch } = useOrders();

  if (isLoading) return <LoadingPage />;
  if (isError)
    return <ErrorPage message={error.message} onRetry={() => refetch()} />;

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">All Orders</h1>
      </div>
      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="min-w-max md:min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Order Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Date Ordered</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders!.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                customerId={order.customerId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
