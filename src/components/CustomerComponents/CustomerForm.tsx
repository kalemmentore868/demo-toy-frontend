import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Customer } from "@/types/Customer";
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

const customerSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().optional().nullable(),
  street: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
});
type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customer?: Customer;
  loading?: boolean;
  onSubmit: (data: CustomerFormValues & { id?: string }) => void;
}

export function CustomerForm({
  customer,
  loading = false,
  onSubmit,
}: CustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
      street: customer?.street ?? "",
      city: customer?.city ?? "",
      state: customer?.state ?? "",
      postalCode: customer?.postalCode ?? "",
      country: customer?.country ?? "",
    },
  });

  const { handleSubmit, control, formState } = form;

  function handleFormSubmit(values: CustomerFormValues) {
    onSubmit({
      ...values,
      id: customer?.id,
    });
  }

  const isSubmitting = formState.isSubmitting || loading;
  const buttonLabel = isSubmitting
    ? "Saving…"
    : customer
    ? "Update Customer"
    : "Create Customer";

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/** Name **/}
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Full name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Email **/}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    type="email"
                    placeholder="you@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Phone **/}
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="(123) 456-7890"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Country **/}
          <FormField
            control={control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Country"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Street **/}
          <FormField
            control={control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street Address</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="123 Main St"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** City **/}
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="City"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** State **/}
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="State or Province"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/** Postal Code **/}
          <FormField
            control={control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="Postal Code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="success" disabled={isSubmitting}>
            {buttonLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
