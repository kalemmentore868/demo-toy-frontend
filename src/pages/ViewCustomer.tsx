import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { BackButton } from "@/components/BackButton";
import { CustomerDetails } from "@/components/CustomerComponents/CustomerDetails";
import { CustomerOrders } from "@/components/CustomerComponents/CustomerOrders";

export default function CustomerPage() {
  const { customerId } = useParams<{ customerId: string }>();

  return (
    <Layout>
      <div className="px-6 pt-2">
        <BackButton route="/customers" />
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Customer Details</h1>
        <CustomerDetails customerId={customerId!} />

        <div className="mt-6">
          <CustomerOrders customerId={customerId!} />
        </div>
      </div>
    </Layout>
  );
}
