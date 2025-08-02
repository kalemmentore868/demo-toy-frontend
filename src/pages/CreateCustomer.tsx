// src/pages/Customers/CreateCustomer.tsx
"use client";

import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { CustomerForm } from "@/components/CustomerComponents/CustomerForm";
import { useAuth } from "@/context/AuthContext";
import CustomerService from "@/services/CustomerService";

import type { ApiResponse } from "@/types/ApiResponse";
import type { Customer } from "@/types/Customer";
import { toast } from "react-toastify";
import { BackButton } from "@/components/BackButton";

export default function CreateCustomer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // v5 mutation with object syntax and proper typing
  const mutation = useMutation<
    ApiResponse<Customer>, // TData
    Error, // TError
    Omit<Customer, "id" | "updatedAt" | "createdAt"> // TVariables
  >({
    mutationFn: (payload) => CustomerService.create(payload, user!.token),
    onSuccess: () => {
      toast.success("Customer created successfully");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      navigate("/customers");
    },
    onError: (err) => {
      toast.error(`Create customer failed: ${err.message}`);
    },
  });

  function handleSubmit(formValues: any & { id?: string }) {
    // map undefined → null to satisfy the service signature
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
    mutation.mutate(payload);
  }

  // Render form, passing loading state into the submit button
  return (
    <Layout>
      <BackButton route="/customers" />
      <h1 className="text-2xl font-semibold mb-4 text-center">New Customer</h1>
      <CustomerForm onSubmit={handleSubmit} loading={mutation.isPending} />
    </Layout>
  );
}
