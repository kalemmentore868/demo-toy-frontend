import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { BackButton } from "@/components/BackButton";
import { LoadingPage } from "@/components/Loader";
import { ErrorPage } from "@/components/ErrorComponent";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import OrderService from "@/services/OrderService";
import type { ApiResponse } from "@/types/ApiResponse";
import type { OrderAndItems } from "@/types/Orders";
import { toast } from "react-toastify";
import { CustomerDetails } from "@/components/CustomerComponents/CustomerDetails";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function OrderDetailsPage() {
  const { customerId, orderId } = useParams<{
    customerId: string;
    orderId: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // fetch order + items
  const {
    data: resp,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<OrderAndItems, Error>({
    queryKey: ["order", customerId, orderId],
    enabled: !!user && !!customerId && !!orderId,
    queryFn: () =>
      OrderService.get(customerId!, orderId!, user!.token).then(
        (r: ApiResponse<OrderAndItems>) => r.data
      ),
  });

  // delete mutation placeholder
  const deleteMutation = useMutation<ApiResponse<null>, Error>({
    mutationFn: () => OrderService.delete(customerId!, orderId!, user!.token),
    onSuccess: () => {
      toast.success("Order deleted");
      queryClient.invalidateQueries({ queryKey: ["orders", customerId] });
      navigate(`/customers/${customerId}`);
    },
    onError: (err) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  if (isLoading) return <LoadingPage />;
  if (isError || !resp)
    return (
      <ErrorPage
        message={error?.message ?? "Order not found"}
        onRetry={() => refetch()}
      />
    );

  const { order, items } = resp;

  return (
    <Layout>
      <BackButton route={`/customers/${customerId}`} />
      <div className="flex md:flex-row flex-col gap-3 mb-3 w-full p-2">
        <CustomerDetails customerId={customerId!} />
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Order ID:</span> {order.id}
            </div>
            <div>
              <span className="font-medium">Date:</span>{" "}
              {new Date(order.orderDate).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Status:</span> {order.status}
            </div>
            <div>
              <span className="font-medium">Scheduled Delivery:</span>{" "}
              {new Date(order.scheduledDeliveryDate).toLocaleDateString()}
            </div>
            {order.dateDelivered && (
              <div>
                <span className="font-medium">Delivered:</span>{" "}
                {new Date(order.dateDelivered).toLocaleDateString()}
              </div>
            )}
            <div>
              <span className="font-medium">Delivery Address:</span>{" "}
              {order.deliveryStreet}, {order.deliveryCity}
              {order.deliveryState && `, ${order.deliveryState}`}{" "}
              {order.deliveryPostal && order.deliveryPostal + ","}{" "}
              {order.deliveryCountry}
            </div>
            <div>
              <span className="font-medium">Total Amount:</span> $
              {order.totalAmount}
            </div>
            <div className="pt-4 mt-7 flex space-x-2">
              <Link to={`/customers/${customerId}/orders/edit/${order.id}`}>
                <Button variant="outline">Edit Order</Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive">Delete Order</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this order? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="space-x-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => deleteMutation.mutate()}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Yes, delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {items.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No items in this order.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-right">Unit Price</th>
                  <th className="px-4 py-2 text-center">Quantity</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="px-4 py-2">{it.productName}</td>
                    <td className="px-4 py-2 text-right">${it.unitPrice}</td>
                    <td className="px-4 py-2 text-center">{it.quantity}</td>
                    <td className="px-4 py-2 text-right">${it.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
