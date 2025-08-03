import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Product } from "@/types/Products";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// 1) Zod schema — note stockQuantity stays string so the form value is string
const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price"),
  category: z.enum([
    "trucks",
    "lego_sets",
    "scooters",
    "stuffed_animals",
    "dolls",
    "kitchen_sets",
    "jewelry_kits",
  ]),
  imageUrl: z.string().optional().nullable(),
  stockQuantity: z.string().regex(/^\d+$/, "Must be an integer"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  loading?: boolean;
  onSubmit: (values: ProductFormValues & { id?: string }) => void;
}

export function ProductForm({
  product,
  loading = false,
  onSubmit,
}: ProductFormProps) {
  // 2) defaultValues must match the schema types (all strings here)
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? "",
      category: product?.category ?? "trucks",
      imageUrl: product?.imageUrl ?? "",
      stockQuantity: String(product?.stockQuantity ?? 0),
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  function handleFormSubmit(values: ProductFormValues) {
    onSubmit({ ...values, id: product?.id });
  }

  const busy = isSubmitting || loading;
  const label = busy
    ? product
      ? "Saving…"
      : "Creating…"
    : product
    ? "Update Product"
    : "Create Product";

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Product Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Short description"
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="0.00" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Stock Quantity */}
          <FormField
            control={control}
            name="stockQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="0" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category */}
        <FormField
          control={control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "trucks",
                      "lego_sets",
                      "scooters",
                      "stuffed_animals",
                      "dolls",
                      "kitchen_sets",
                      "jewelry_kits",
                    ].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image URL */}
        <FormField
          control={control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="https://example.com/img.png"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="success" disabled={busy}>
            {label}
          </Button>
        </div>
      </form>
    </Form>
  );
}
