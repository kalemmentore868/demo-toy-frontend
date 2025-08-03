import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import ProductService from "@/services/ProductService";
import type { Product } from "@/types/Products";
import type { Customer } from "@/types/Customer";
import {
  orderSchema,
  type NewOrderSchema,
  type OrderFormValues,
} from "@/schemas/order";
import { useAuth } from "@/context/AuthContext";

interface OrderFormProps {
  customer: Customer;
  order?: Partial<OrderFormValues> & { items: OrderFormValues["items"] };
  onSubmit: (values: NewOrderSchema) => void;
  loading?: boolean;
}

export function OrderForm({
  customer,
  order,
  onSubmit,
  loading,
}: OrderFormProps) {
  const { user } = useAuth();
  const { data: products = [] } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: () => ProductService.list(user!.token).then((r) => r.data),
  });

  const form = useForm<OrderFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderDate: order?.orderDate ?? new Date().toISOString().slice(0, 10),
      scheduledDeliveryDate:
        order?.scheduledDeliveryDate ??
        new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      dateDelivered: order?.dateDelivered,
      status: order?.status ?? "pending",
      deliveryStreet: order?.deliveryStreet ?? customer.street ?? "",
      deliveryCity: order?.deliveryCity ?? customer.city ?? "",
      deliveryState: order?.deliveryState ?? customer.state ?? "",
      deliveryPostal: order?.deliveryPostal ?? customer.postalCode ?? "",
      deliveryCountry: order?.deliveryCountry ?? customer.country ?? "",
      items: order?.items.map((it) => ({
        productId: it.productId,
        quantity: it.quantity,
      })) ?? [{ productId: "", quantity: 1 }],
    },
  });

  const { control, handleSubmit, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // watch only items
  const watchedItems = watch("items");

  // compute line infos & overall total on every render
  const lineInfos = watchedItems.map((it) => {
    const prod = products.find((p) => p.id === it.productId);
    const unit = prod?.price ?? "0.00";
    const total = (parseFloat(unit) * it.quantity).toFixed(2);
    return { unit, total };
  });

  const orderTotal = lineInfos
    .reduce((sum, li) => sum + parseFloat(li.total), 0)
    .toFixed(2);

  function onFormSubmit(values: OrderFormValues) {
    const itemsWithPrices = values.items.map((it, idx) => ({
      productId: it.productId,
      quantity: it.quantity,
      unitPrice: lineInfos[idx].unit,
      totalPrice: lineInfos[idx].total,
    }));

    onSubmit({
      ...values,
      totalAmount: orderTotal,
      items: itemsWithPrices,
      customerId: customer.id,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* DATE & STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(
            ["orderDate", "scheduledDeliveryDate", "dateDelivered"] as const
          ).map((name) => (
            <FormField
              key={name}
              control={control}
              name={name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{name.replace(/([A-Z])/g, " $1")}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["pending", "shipped", "delivered", "cancelled"].map(
                        (s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* DELIVERY FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(
            [
              "deliveryStreet",
              "deliveryCity",
              "deliveryState",
              "deliveryPostal",
              "deliveryCountry",
            ] as const
          ).map((fieldName) => (
            <FormField
              key={fieldName}
              control={control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{field.name.replace("delivery", "")}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        {/* ORDER ITEMS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Items</h2>
            <Button
              size="sm"
              type="button"
              onClick={() => append({ productId: "", quantity: 1 })}
            >
              + Add Item
            </Button>
          </div>

          {fields.map((field, idx) => (
            <div
              key={field.id}
              className="grid grid-cols-1 gap-2 items-end md:grid-cols-6"
            >
              <FormField
                control={control}
                name={`items.${idx}.productId`}
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Product</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`items.${idx}.quantity`}
                render={({ field }) => (
                  <FormItem className="md:col-span-1">
                    <FormLabel>Qty</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        value={field.value}
                        onChange={(e) => {
                          const v = parseInt(e.target.value, 10);
                          field.onChange(isNaN(v) ? 0 : v);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem className="md:col-span-1">
                <FormLabel>Unit</FormLabel>
                <FormControl>
                  <Input value={lineInfos[idx].unit} disabled />
                </FormControl>
              </FormItem>

              <FormItem className="md:col-span-1">
                <FormLabel>Total</FormLabel>
                <FormControl>
                  <Input value={lineInfos[idx].total} disabled />
                </FormControl>
              </FormItem>

              <div className="md:col-span-1 text-right">
                <Button variant="ghost" size="icon" onClick={() => remove(idx)}>
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* ORDER TOTAL */}
        <FormItem>
          <FormLabel>Order Total</FormLabel>
          <FormControl>
            <Input value={orderTotal} disabled />
          </FormControl>
        </FormItem>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <Button type="submit" variant="success" disabled={loading}>
            {order ? "Update Order" : "Create Order"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
