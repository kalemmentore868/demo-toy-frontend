import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { BackButton } from "@/components/BackButton";
import { LoadingPage } from "@/components/Loader";
import { ErrorPage } from "@/components/ErrorComponent";
import { useAuth } from "@/context/AuthContext";
import CustomerService from "@/services/CustomerService";
import OrderService from "@/services/OrderService";
import { OrderForm } from "@/components/OrderComponents/OrderForm";
import type { Customer } from "@/types/Customer";
import type { ApiResponse } from "@/types/ApiResponse";
import type { Order } from "@/types/Orders";
import { toast } from "react-toastify";
import type { NewOrderSchema } from "@/schemas/order";

export default function NewOrderPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1️⃣ Fetch customer
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

  // 2️⃣ Set up create-order mutation
  const {
    mutate: createOrder,
    isPending,
    isError: isCreateError,
    error: createError,
  } = useMutation<
    ApiResponse<Order>,
    Error,
    Parameters<typeof OrderService.create>[1]
  >({
    mutationFn: (payload) =>
      OrderService.create(customerId!, payload, user!.token),
    onSuccess: () => {
      toast.success("Order created");
      queryClient.invalidateQueries({ queryKey: ["orders", customerId] });
      navigate(`/customers/${customerId}`);
    },
    onError: (err) => {
      toast.error(`Failed to create order: ${err.message}`);
    },
  });

  if (isCustomerLoading) return <LoadingPage />;
  if (isCustomerError || !customer)
    return (
      <ErrorPage
        message={customerError?.message ?? "Customer not found"}
        onRetry={() => refetchCustomer()}
      />
    );

  function handleSubmit(data: NewOrderSchema) {
    if (!customer) {
      toast.error("Customer not found");
      return;
    }

    // merge order & items into one payload if your API expects it
    createOrder(data);
  }

  return (
    <Layout>
      <BackButton route={`/customers/${customerId}`} />
      <h1 className="text-2xl font-semibold mb-4 text-center">
        New Order for {customer.name}
      </h1>

      <OrderForm
        customer={customer}
        onSubmit={handleSubmit}
        loading={isPending}
      />

      {isCreateError && (
        <div className="mt-4 text-center text-destructive">
          {createError!.message}
        </div>
      )}
    </Layout>
  );
}
