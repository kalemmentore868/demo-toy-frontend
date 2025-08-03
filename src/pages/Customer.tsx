import { useCustomers } from "@/hooks/useCustomers";

import { ErrorPage } from "@/components/ErrorComponent";
import { LoadingPage } from "@/components/Loader";
import { CustomerRow } from "@/components/CustomerComponents/CustomerRow";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function CustomersList() {
  const {
    data: customers,
    isLoading,
    isError,
    error,
    refetch,
  } = useCustomers();

  if (isLoading) return <LoadingPage />;
  if (isError)
    return <ErrorPage message={error.message} onRetry={() => refetch()} />;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Link to="/customers/new">
          <Button variant={"success"}>Create New Customer</Button>
        </Link>
      </div>
      <div className="overflow-x-auto md:overflow-x-visible">
        <table className="min-w-max md:min-w-full divide-y divide-border">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left hidden sm:table-cell">
                Phone
              </th>
              <th className="px-4 py-2 text-left hidden md:table-cell">
                Country
              </th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border w-full">
            {customers!.map((customer) => (
              <CustomerRow key={customer.id} customer={customer} />
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
