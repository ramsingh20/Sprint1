import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RotateCcw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getCurrentUser, updateCurrentUser } from "@/services/authService";

const generalSettingsSchema = z.object({
  workspaceName: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters.")
    .max(50, "Workspace name must not exceed 50 characters."),

  description: z.string().trim().max(200, "Description must not exceed 200 characters."),
  language: z.string().min(1, "Please select a language."),
  timezone: z.string().min(1, "Please select a timezone."),
});

const defaultValues = {
    workspaceName: "PulseBoard Enterprise",
    description: "Enterprise analytics and business intelligence workspace.",
    language: "en",
    timezone: "Asia/Kolkata",
};

const GeneralSettings = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty }, } = useForm({
        resolver: zodResolver(generalSettingsSchema),
        defaultValues,
    });

    useEffect(() => {
      let active = true;
      getCurrentUser().then(({ user }) => {
        if (active && user?.generalSettings) reset(user.generalSettings);
      }).catch((error) => {
        toast.error(error.message || "Failed to load general settings.");
      });
      return () => { active = false; };
    }, [reset]);

    const onSubmit = async (values) => {
      try {
        const { user } = await updateCurrentUser({ generalSettings: values });
        reset(user.generalSettings);
        toast.success("General settings updated successfully.");
      } catch (error) {
        toast.error(error.message || "Failed to update general settings.");
      }
    };

    const handleReset = () => {
        reset();
        toast.info("Changes have been reset.");
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your workspace information and regional preferences.</p>
      </div>

      {/* Workspace Name */}
      <div className="space-y-2">
        <label htmlFor="workspaceName" className="text-sm font-medium text-foreground">Workspace Name</label>

        <input
          id="workspaceName"
          {...register("workspaceName")}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          placeholder="Enter workspace name"
        />

        {errors.workspaceName && (<p className="text-sm text-destructive">{errors.workspaceName.message}</p>)}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-foreground">Description</label>

        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
          placeholder="Describe your workspace"
        />

        {errors.description && (<p className="text-sm text-destructive">{errors.description.message}</p>)}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="language" className="text-sm font-medium text-foreground">Language</label>

          <select id="language" {...register("language")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
          {errors.language && (<p className="text-sm text-destructive">{errors.language.message}</p>)}
        </div>

        <div className="space-y-2">
          <label htmlFor="timezone" className="text-sm font-medium text-foreground">Timezone</label>

          <select id="timezone" {...register("timezone")} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/20">
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="UTC">UTC</option>

            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
          {errors.timezone && (<p className="text-sm text-destructive"> {errors.timezone.message}</p>)}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={handleReset} disabled={!isDirty || isSubmitting} className="gap-2">
          <RotateCcw className="size-4" /> Reset
        </Button>

        <Button type="submit" disabled={isSubmitting} className="gap-2">
          <Save className="size-4" /> {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};

export default GeneralSettings;