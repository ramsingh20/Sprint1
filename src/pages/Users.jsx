import PageHeader from "@/components/common/PageHeader";
import UserDetailsDialog from "@/features/users/components/UserDetailsDialog";
import UsersTable from "@/features/users/components/UsersTable";
import { useEffect, useState } from "react";
import EditUserDialog from "@/features/users/components/EditUserDialog";
import { toast } from "sonner";
import DeleteUserDialog from "@/features/users/components/DeleteUserDialog";
import { getUserById, getUsers, updateUser } from "@/services/userService";

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getUsers();

        setUsers(data);
      } catch (error) {
        console.error("Failed to load users:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);
  

  const handleViewUser = async (user) => {
    try {
      const userDetails = await getUserById(user._id);

      setSelectedUser(userDetails);
      setIsDetailsOpen(true);
    } catch (error) {
      console.error("Failed to fetch user details:", error);

      toast.error(error.message || "Failed to fetch user details");
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };
  const handleSaveUser = async (updatedUser) => {
    try {
      const updatedUserData = await updateUser(updatedUser._id, {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      });

      setUsers((currentUsers) =>
        currentUsers.map((user) => user.id === updatedUserData.id ? updatedUserData : user)
      );

      setSelectedUser(updatedUserData);
      setIsEditOpen(false);
      toast.success("User updated successfully.");
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = (user) => {
    setUsers((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== user.id));

    setIsDeleteOpen(false);
    setSelectedUser(null);

    toast.success("User deleted successfully.");
  };

  const handleDeactivateUser = (user) => {
    setUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === user.id ? {...currentUser,status: "Inactive",} : currentUser
      )
    );
    toast.success(`${user.name} has been deactivated.`);
  };

  const handleActivateUser = (user) => {
    setUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === user.id ? {...currentUser, status: "Active",} : currentUser
      )
    );

    toast.success(`${user.name} has been activated.`);
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading users...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader title="Users" description="Manage your users, roles, and account access." />
      <UsersTable 
        data={users}
        onViewUser={handleViewUser} 
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onDeactivateUser={handleDeactivateUser}
        onActivateUser={handleActivateUser}
      />
      <UserDetailsDialog user={selectedUser} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      <EditUserDialog user={selectedUser} open={isEditOpen} onOpenChange={setIsEditOpen} onSave={handleSaveUser} />
      <DeleteUserDialog user={selectedUser} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} onConfirm={handleConfirmDelete} />
    </div>
  );
};

export default Users;