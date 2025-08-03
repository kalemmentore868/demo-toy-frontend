// src/pages/Users/ListUsers.tsx
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { LoadingPage } from "@/components/Loader";
import { ErrorPage } from "@/components/ErrorComponent";
import { UserRow } from "@/components/UsersComponent/UserRow";
import { useUsers } from "@/hooks/useUsers";
import UserService from "@/services/UserService";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import type { User } from "@/types/User";

export default function ListUsersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: users, isLoading, isError, error, refetch } = useUsers();

  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: (id) => UserService.delete(id, user!.token).then(() => {}),
    onSuccess: () => {
      toast.success("User deleted");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      toast.error(`Delete failed: ${err.message}`);
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) return <LoadingPage />;
  if (isError)
    return <ErrorPage message={error!.message} onRetry={() => refetch()} />;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
        {user!.role === "admin" && (
          <Link to="/users/new">
            <Button variant="success">Create New User</Button>
          </Link>
        )}
      </div>
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Role</th>
            {user!.role === "admin" && (
              <th className="px-4 py-2 text-center">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {users!.map((u: User) => (
            <UserRow
              key={u.id}
              user={u}
              onDelete={handleDelete}
              currentRole={user!.role}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
