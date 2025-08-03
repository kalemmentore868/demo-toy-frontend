// src/pages/Users/EditUser.tsx
"use client";

import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Layout } from "@/components/Layout";
import { BackButton } from "@/components/BackButton";
import { LoadingPage } from "@/components/Loader";
import { ErrorPage } from "@/components/ErrorComponent";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/context/AuthContext";
import UserService from "@/services/UserService";

import type { User } from "@/types/User";
import { toast } from "react-toastify";
import { useEffect } from "react";

const editUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  role: z.enum(["admin", "manager"], "Select a role"),
});
type EditUserFormValues = z.infer<typeof editUserSchema>;

export default function EditUserPage() {
  const { user: me } = useAuth();
  const { id: userId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const {
    data: fetched,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<User, Error>({
    queryKey: ["user", userId],
    enabled: !!me && !!userId,
    queryFn: async () => {
      const res = await UserService.get(userId!, me!.token);
      return res.data;
    },
  });

  const { mutate: updateUser, isPending: isUpdating } = useMutation<
    User,
    Error,
    EditUserFormValues
  >({
    mutationFn: (payload) =>
      UserService.update(userId!, payload, me!.token).then((res) => res.data),
    onSuccess: () => {
      toast.success("User updated");
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", userId] });
      navigate("/users");
    },
    onError: (err) => {
      toast.error(`Update failed: ${err.message}`);
    },
  });

  // 3️⃣ Form setup
  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      username: fetched?.username ?? "",
      role: (fetched?.role as "admin" | "manager") ?? "manager",
    },
  });

  const { control, handleSubmit, reset } = form;

  // **Reset form** when fetched changes:
  useEffect(() => {
    if (fetched) {
      reset({
        username: fetched.username,
        role: fetched.role as "admin" | "manager",
      });
    }
  }, [fetched, reset]);

  function onSubmit(data: EditUserFormValues) {
    updateUser(data);
  }

  if (isLoading) return <LoadingPage />;
  if (isError || !fetched)
    return (
      <ErrorPage
        message={error?.message ?? "Failed to load user"}
        onRetry={() => refetch()}
      />
    );

  return (
    <Layout>
      <BackButton route="/users" />
      <h1 className="text-2xl font-semibold mb-4 text-center">Edit User</h1>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-md mx-auto space-y-6"
        >
          {/* Username */}
          <FormField
            control={control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  {/* instead of {...field}, wire up Radix Select properly */}
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" variant="success" disabled={isUpdating}>
              {isUpdating ? "Saving…" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </Layout>
  );
}
