import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const editUserSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters."),
  email: z
    .string()
    .email("Please enter a valid email address."),

  role: z.enum(["Admin", "Manager", "Customer"]),
  status: z.enum(["Active", "Pending", "Inactive"]),
});

const EditUserDialog = ({ user, open, onOpenChange, onSave, }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting },} = useForm({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Customer",
      status: "Active",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, reset]);

  const submitForm = (values) => {
    onSave({
      ...user,
      ...values,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information and account settings.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium" >Name</label>
            <Input id="name" {...register("name")} placeholder="Enter user name" />

            {errors.name && (<p className="text-sm text-destructive">{errors.name.message}</p>)}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input id="email" type="email" {...register("email")} placeholder="Enter email address" />

            {errors.email && (<p className="text-sm text-destructive">{errors.email.message}</p>)}
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">Role</label>
            <select
              id="role"
              {...register("role")}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Customer">Customer</option>
            </select>

            {errors.role && (<p className="text-sm text-destructive">{errors.role.message}</p>)}
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <select
              id="status"
              {...register("status")}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>

            {errors.status && (<p className="text-sm text-destructive">{errors.status.message}</p>)}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;