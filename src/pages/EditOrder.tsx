import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { BackButton } from "@/components/BackButton";
import { LoadingPage } from "@/components/Loader";
import { ErrorPage } from "@/components/ErrorComponent";
import { useAuth } from "@/context/AuthContext";
import OrderService from "@/services/OrderService";
import CustomerService from "@/services/CustomerService";
import { OrderForm } from "@/components/OrderComponents/OrderForm";
import type { ApiResponse } from "@/types/ApiResponse";
import type { OrderAndItems, Order, PopulatedOrderItem } from "@/types/Orders";
import { toast } from "react-toastify";
import type { Customer } from "@/types/Customer";
import type { NewOrderSchema } from "@/schemas/order";

export default function EditOrderPage() {
  const { customerId, orderId } = useParams<{
    customerId: string;
    orderId: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch customer (for address defaults)
  const {
    data: customer,
    isLoading: isCustomerLoading,
    isError: isCustomerError,
    error: customerError,
    refetch: refetchCustomer,
  } = useQuery<Customer, Error>({
    queryKey: ["customer", customerId],
    enabled: !!user && !!customerId,
    queryFn: () =>
      CustomerService.get(customerId!, user!.token).then((res) => res.data),
  });

  // Fetch existing order + items
  const {
    data: orderResp,
    isLoading: isOrderLoading,
    isError: isOrderError,
    error: orderError,
    refetch: refetchOrder,
  } = useQuery<OrderAndItems, Error>({
    queryKey: ["order", customerId, orderId],
    queryFn: () =>
      OrderService.get(customerId!, orderId!, user!.token).then((r) => r.data),
    enabled: !!customerId && !!orderId && !!user,
  });

  const {
    mutate: updateOrder,
    isPending: isUpdating,
    isError: isUpdateError,
    error: updateError,
  } = useMutation<ApiResponse<Order>, Error, NewOrderSchema>({
    mutationFn: (payload) =>
      OrderService.update(customerId!, orderId!, payload, user!.token),
    onSuccess: () => {
      toast.success("Order updated");
      queryClient.invalidateQueries({
        queryKey: ["order", customerId, orderId],
      });
      queryClient.invalidateQueries({ queryKey: ["orders", customerId] });
      navigate(`/customers/${customerId}`);
    },
    onError: (err) => {
      toast.error(`Update failed: ${err.message}`);
    },
  });

  if (isCustomerLoading || isOrderLoading) return <LoadingPage />;
  if (isCustomerError || !customer)
    return (
      <ErrorPage
        message={customerError?.message ?? "Customer not found"}
        onRetry={() => refetchCustomer()}
      />
    );
  if (isOrderError || !orderResp)
    return (
      <ErrorPage
        message={orderError?.message ?? "Order not found"}
        onRetry={() => refetchOrder()}
      />
    );

  const { order, items } = orderResp;
  console.log(order);

  // Prepare form initial values
  const initialOrder = {
    orderDate: new Date(order.orderDate).toISOString().slice(0, 10),
    scheduledDeliveryDate: new Date(order.scheduledDeliveryDate)
      .toISOString()
      .slice(0, 10),
    dateDelivered: order.dateDelivered
      ? new Date(order.dateDelivered).toISOString().slice(0, 10)
      : undefined,
    status: order.status,
    deliveryStreet: order.deliveryStreet,
    deliveryCity: order.deliveryCity,
    deliveryState: order.deliveryState,
    deliveryPostal: order.deliveryPostal,
    deliveryCountry: order.deliveryCountry,
    items: items.map((it: PopulatedOrderItem) => ({
      productId: it.productId,
      quantity: it.quantity,
    })),
  };

  function handleSubmit(values: NewOrderSchema) {
    updateOrder(values);
  }

  return (
    <Layout>
      <BackButton route={`/customers/${customerId}/orders/${orderId}`} />
      <h1 className="text-2xl font-semibold mb-4 text-center">Edit Order</h1>

      <OrderForm
        customer={customer}
        order={initialOrder}
        onSubmit={handleSubmit}
        loading={isUpdating}
      />

      {isUpdateError && (
        <div className="mt-4 text-center text-destructive">
          {updateError!.message}
        </div>
      )}
    </Layout>
  );
}
