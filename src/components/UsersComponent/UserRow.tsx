import { Link } from "react-router-dom";
import { Trash, Edit } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import type { FC } from "react";
import type { User } from "@/types/User";

interface UserRowProps {
  user: User;
  onDelete: (id: string) => void;
  currentRole: "admin" | "manager";
  isDeleting: boolean;
}

export const UserRow: FC<UserRowProps> = ({
  user,
  onDelete,
  currentRole,
  isDeleting,
}) => {
  return (
    <tr className="hover:bg-muted">
      <td className="px-4 py-2">{user.username}</td>
      <td className="px-4 py-2">{user.email}</td>
      <td className="px-4 py-2">{user.role}</td>
      {currentRole === "admin" && (
        <td className="px-4 py-2 text-right space-x-2">
          <Link to={`/users/edit/${user.id}`}>
            <Button variant="outline" title="Edit user">
              <Edit className="h-4 w-4" /> Edit User
            </Button>
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" title="Delete user">
                <Trash className="h-4 w-4" /> Delete User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete{" "}
                  <strong>{user.username}</strong>? This cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="space-x-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  disabled={isDeleting}
                  onClick={() => {
                    onDelete(user.id);
                  }}
                >
                  {isDeleting ? "Deleting User..." : "Yes, delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </td>
      )}
    </tr>
  );
};
