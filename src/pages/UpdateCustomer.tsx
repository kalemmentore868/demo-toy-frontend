import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { CustomerForm } from "@/components/CustomerComponents/CustomerForm";
import { BackButton } from "@/components/BackButton";
import { useAuth } from "@/context/AuthContext";
import CustomerService from "@/services/CustomerService";
import { LoadingPage } from "@/components/Loader";
import { ErrorPage } from "@/components/ErrorComponent";
import { toast } from "react-toastify";
import type { Customer } from "@/types/Customer";

export default function EditCustomer() {
  const { user } = useAuth();
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1️⃣ Fetch the existing customer
  const {
    data: customer,
    isLoading: isFetching,
    isError: fetchError,
    error: fetchErr,
    refetch,
  } = useQuery<Customer, Error>({
    queryKey: ["customer", customerId],
    enabled: !!user && !!customerId,
    queryFn: async () => {
      const res = await CustomerService.get(customerId!, user!.token);
      return res.data;
    },
  });

  // 2️⃣ Set up the update mutation
  const {
    mutate: updateCustomer,
    isPending: isUpdating,
    isError: updateError,
    error: updateErr,
  } = useMutation<
    Customer,
    Error,
    Omit<Customer, "id" | "createdAt" | "updatedAt">
  >({
    mutationFn: (payload) =>
      CustomerService.update(customerId!, payload, user!.token).then(
        (res) => res.data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      toast.success("Customer updated");
      navigate("/customers");
    },
    onError: (err) => {
      toast.error(`Update failed: ${err.message}`);
    },
  });

  // 3️⃣ Loading / error states
  if (isFetching) return <LoadingPage />;
  if (fetchError)
    return <ErrorPage message={fetchErr!.message} onRetry={() => refetch()} />;

  // 4️⃣ Handle form submit
  function handleSubmit(formValues: any & { id?: string }) {
    const payload: Omit<Customer, "id" | "createdAt" | "updatedAt"> = {
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone ?? null,
      street: formValues.street ?? null,
      city: formValues.city ?? null,
      state: formValues.state ?? null,
      postalCode: formValues.postalCode ?? null,
      country: formValues.country ?? null,
    };
    updateCustomer(payload);
  }

  return (
    <Layout>
      <BackButton route="/customers" />
      <h1 className="text-2xl font-semibold mb-4 text-center">Edit Customer</h1>

      <CustomerForm
        customer={customer!}
        onSubmit={handleSubmit}
        loading={isUpdating}
      />

      {updateError && (
        <div className="mt-4 text-center text-destructive">
          {updateErr!.message}
        </div>
      )}
    </Layout>
  );
}
