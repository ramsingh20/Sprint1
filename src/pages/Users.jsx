import PageHeader from "@/components/common/PageHeader";
import UserDetailsDialog from "@/features/users/components/UserDetailsDialog";
import UsersTable from "@/features/users/components/UsersTable";
import { usersData } from "@/features/users/data/usersData";
import { useState } from "react";
import EditUserDialog from "@/features/users/components/EditUserDialog";
import { toast } from "sonner";
import DeleteUserDialog from "@/features/users/components/DeleteUserDialog";

const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [users, setUsers] = useState(usersData);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };
  const handleSaveUser = (updatedUser) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) => user.id === updatedUser.id ? updatedUser : user)
    );
    setSelectedUser(updatedUser);
    setIsEditOpen(false);

    toast.success("User updated successfully.");
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