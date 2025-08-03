import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { BackButton } from "@/components/BackButton";
import { ProductForm } from "@/components/ProductComponents/ProductForm";
import { useAuth } from "@/context/AuthContext";
import ProductService from "@/services/ProductService";
import type { Product } from "@/types/Products";
import type { ApiResponse } from "@/types/ApiResponse";
import { toast } from "react-toastify";

export default function CreateProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createProductMutation = useMutation<
    ApiResponse<Product>, // TData
    Error, // TError
    Omit<Product, "id" | "createdAt" | "updatedAt"> // TVariables
  >({
    mutationFn: (payload) => ProductService.create(payload, user!.token),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
    onError: (err) => {
      toast.error(`Create product failed: ${err.message}`);
    },
  });

  function handleSubmit(formValues: any) {
    // map the form values into the shape ProductService.create expects
    const payload: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      name: formValues.name,
      description: formValues.description ?? null,
      price: formValues.price,
      category: formValues.category,
      imageUrl: formValues.imageUrl ?? null,
      stockQuantity: Number(formValues.stockQuantity),
    };
    createProductMutation.mutate(payload);
  }

  return (
    <Layout>
      <BackButton route="/products" />
      <h1 className="text-2xl font-semibold mb-4 text-center">New Product</h1>
      <ProductForm
        onSubmit={handleSubmit}
        loading={createProductMutation.isPending}
      />
      {createProductMutation.isError && (
        <div className="mt-4 text-center text-destructive">
          {createProductMutation.error?.message}
        </div>
      )}
    </Layout>
  );
}
