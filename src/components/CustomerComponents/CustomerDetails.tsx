import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import CustomerService from "@/services/CustomerService";
import type { Customer } from "@/types/Customer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
import { toast } from "react-toastify";
import ReportsService from "@/services/ReportsService";
import { useState } from "react";

interface CustomerDetailsProps {
  customerId: string;
}

export function CustomerDetails({ customerId }: CustomerDetailsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reportGenerating, setReportGenerating] = useState(false);

  const {
    data: customer,
    isLoading,
    isError,
    error,
  } = useQuery<Customer, Error>({
    queryKey: ["customer", customerId],
    enabled: !!user,
    queryFn: async () => {
      const res = await CustomerService.get(customerId, user!.token);
      return res.data;
    },
  });

  const deleteMutation = useMutation<void, Error, void>({
    mutationFn: () =>
      CustomerService.delete(customerId, user!.token).then(() => {}),
    onSuccess: () => {
      toast.success("Customer deleted");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate("/customers");
    },
    onError: (err) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const handleDownload = async () => {
    if (!user) return;
    setReportGenerating(true);
    try {
      const pdfBlob = await ReportsService.downloadCustomerReport(
        customerId,
        user.token
      );
      // Create a link to download
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `customer-${customer?.name}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message);
    } finally {
      setReportGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-destructive">
        Error loading customer: {error.message}
      </div>
    );
  }

  return (
    <Card className="max-w-xl ">
      <CardHeader>
        <CardTitle>Customer Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <span className="font-medium">Name:</span> {customer!.name}
        </div>
        <div>
          <span className="font-medium">Email:</span> {customer!.email}
        </div>
        <div>
          <span className="font-medium">Phone:</span> {customer!.phone ?? "—"}
        </div>
        <div>
          <span className="font-medium">Address:</span>
        </div>
        <div>
          {customer!.street && <div>{customer!.street}</div>}
          <div>
            {[customer!.city, customer!.state, customer!.postalCode]
              .filter(Boolean)
              .join(", ")}
          </div>
          {customer!.country && <div>{customer!.country}</div>}
        </div>
        <div className="flex space-x-2 pt-4">
          <Link to={`/customers/edit/${customerId}`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Deleting this customer will also remove all their orders and
                  order items. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="space-x-2">
                {/* Cancel closes the dialog */}
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>

                {/* Confirm deletion */}
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

          <Button disabled={reportGenerating} onClick={handleDownload}>
            {reportGenerating ? "Report Generating..." : "Export Report"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
