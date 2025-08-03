// src/pages/Users/CreateUser.tsx
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { CreateUserForm } from "@/components/UsersComponent/CreateUserForm";
import AuthService, { type RegisterInput } from "@/services/AuthService";
import { toast } from "react-toastify";
import type { ApiResponse } from "@/types/ApiResponse";
import type { User } from "@/types/User";
import { useAuth } from "@/context/AuthContext";
import { BackButton } from "@/components/BackButton";

export default function CreateUserPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const mutation = useMutation<
    ApiResponse<User>, // TData
    Error, // TError
    RegisterInput
  >({
    mutationFn: (payload) => AuthService.register(payload, user!.token),
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      navigate("/users");
    },
    onError: (err) => {
      toast.error(`Create user failed: ${err.message}`);
    },
  });

  return (
    <Layout>
      <BackButton route="/users" />
      <h1 className="text-2xl font-semibold mb-4">New User</h1>
      <CreateUserForm
        loading={mutation.isPending}
        onSubmit={(vals) => mutation.mutate(vals)}
      />
    </Layout>
  );
}
