import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { BackButton } from "@/components/BackButton";
import { LoadingPage } from "@/components/Loader";
import { ErrorPage } from "@/components/ErrorComponent";
import { useAuth } from "@/context/AuthContext";
import ProductService from "@/services/ProductService";
import {
  ProductForm,
  type ProductFormValues,
} from "@/components/ProductComponents/ProductForm";
import { toast } from "react-toastify";
import type { Product } from "@/types/Products";

export default function EditProductPage() {
  const { user } = useAuth();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1️⃣ Fetch existing product
  const {
    data: product,
    isLoading: isFetching,
    isError: fetchError,
    error: fetchErr,
    refetch,
  } = useQuery<Product, Error>({
    queryKey: ["product", productId],
    enabled: !!user && !!productId,
    queryFn: async () => {
      const res = await ProductService.get(productId!, user!.token);
      return res.data;
    },
  });

  // 2️⃣ Mutation to update product
  const {
    mutate: updateProduct,
    isPending: isUpdating,
    isError: updateError,
    error: updateErr,
  } = useMutation<
    Product,
    Error,
    Omit<Product, "id" | "createdAt" | "updatedAt">
  >({
    mutationFn: (payload) =>
      ProductService.update(productId!, payload, user!.token).then(
        (res) => res.data
      ),
    onSuccess: () => {
      toast.success("Product updated");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      navigate("/products");
    },
    onError: (err) => {
      toast.error(`Update failed: ${err.message}`);
    },
  });

  // 3️⃣ Loading / error states
  if (isFetching) return <LoadingPage />;
  if (fetchError)
    return (
      <ErrorPage
        message={fetchErr?.message ?? "Product not found"}
        onRetry={() => refetch()}
      />
    );

  // 4️⃣ Handle form submission
  function handleSubmit(values: ProductFormValues) {
    const payload: Omit<Product, "id" | "createdAt" | "updatedAt"> = {
      name: values.name,
      description: values.description ?? null,
      price: values.price,
      category: values.category,
      imageUrl: values.imageUrl ?? null,
      stockQuantity: Number(values.stockQuantity),
    };
    updateProduct(payload);
  }

  return (
    <Layout>
      <BackButton route="/products" />
      <h1 className="text-2xl font-semibold mb-4 text-center">Edit Product</h1>

      <ProductForm
        product={product!}
        onSubmit={handleSubmit}
        loading={isUpdating}
      />

      {updateError && (
        <div className="mt-4 text-center text-destructive">
          {updateErr?.message}
        </div>
      )}
    </Layout>
  );
}
