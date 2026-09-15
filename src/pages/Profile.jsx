import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import PageHeader from "@/components/common/PageHeader";
import { getCurrentUser, updateCurrentUser } from "@/services/authService";
import { Button } from "@/components/ui/button";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),
});

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getCurrentUser();

        setUser(data);

        reset({
          name: data.name,
          email: data.email,
        });
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError(error.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  const onSubmit = async (formData) => {
    try {
      setSaving(true);

      const updatedUser = await updateCurrentUser({
        name: formData.name,
        email: formData.email,
      });

      setUser(updatedUser);

      reset({
        name: updatedUser.name,
        email: updatedUser.email,
      });

      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile:", error);

      toast.error(
        error.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Profile"
          description="View and manage your account information."
        />

        <div className="rounded-xl border bg-card p-6">
          <p className="text-sm text-muted-foreground">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Profile"
          description="View and manage your account information."
        />

        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="text-sm text-destructive">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="View and manage your account information."
      />

      {/* Profile Header */}
      <div className="rounded-xl border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
            {user.name?.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              {user.name}
            </h2>

            <p className="text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-6 text-lg font-semibold">
          Edit Profile
        </h3>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="text-sm font-medium"
            >
              Full Name
            </label>

            <input
              id="name"
              type="text"
              {...register("name")}
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />

            {errors.name && (
              <p className="text-sm text-destructive text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              {...register("email")}
              className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />

            {errors.email && (
              <p className="text-sm text-destructive text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving || !isDirty}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>

      {/* Account Information */}
      <div className="rounded-xl border bg-card p-6">
        <h3 className="mb-6 text-lg font-semibold">
          Account Information
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">
              Role
            </p>

            <p className="mt-1 font-medium">
              {user.role}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Account Status
            </p>

            <p className="mt-1 font-medium">
              {user.status}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Joined
            </p>

            <p className="mt-1 font-medium">
              {formatDate(user.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">
              Last Updated
            </p>

            <p className="mt-1 font-medium">
              {formatDate(user.updatedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;