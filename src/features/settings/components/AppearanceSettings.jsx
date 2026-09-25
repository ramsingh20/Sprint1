import { useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { updateCurrentUser } from "@/services/authService";
import { useTheme } from "@/context/ThemeContext";

const themeOptions = [
  {
    value: "light",
    label: "Light",
    description: "Use the light appearance.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Use the dark appearance.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description: "Follow your operating system preference.",
    icon: Monitor,
  },
];

const AppearanceSettings = () => {
  const { theme, setTheme, isThemeLoading } = useTheme();
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeChange = async (value) => {
    if (isSaving || value === theme) return;
    const previousTheme = theme;
    setTheme(value);
    setIsSaving(true);
    try {
      await updateCurrentUser({ appearancePreference: value });
      const themeLabel = value.charAt(0).toUpperCase() + value.slice(1);
      toast.success("Appearance changed to " + themeLabel + ".");
    } catch (error) {
      setTheme(previousTheme);
      toast.error(error.message || "Failed to save appearance preference.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">Customize how PulseBoard looks on your device.</p>
      </div>

      {/* Theme */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-foreground">Theme</h3>
          <p className="mt-1 text-sm text-muted-foreground">Select your preferred application appearance.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = theme === option.value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        disabled={isThemeLoading || isSaving}
                        onClick={() => handleThemeChange(option.value)}
                        className={`group rounded-xl border p-4 text-left transition-all ${isSelected ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-border bg-background hover:border-primary/50 hover:bg-muted/50"}`}
                    >
                        <div className="flex items-start justify-between">
                            <div className={`flex size-10 items-center justify-center rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`} >
                                <Icon className="size-5" />
                            </div>
                            <div className={`size-4 rounded-full border-2 ${isSelected ? "border-primary bg-primary" : "border-muted-foreground/40"}`} />
                        </div>
                        <div className="mt-4">
                            <p className="text-sm font-semibold text-foreground">{option.label}</p>
                            <p className="mt-1 text-xs leading-5 text-muted-foreground">{option.description}</p>
                        </div>
                    </button>
                );
            })}
        </div>
      </div>
      {/* Current theme */}
      <div className="rounded-lg border border-border bg-muted/40 p-4">
        <p className="text-sm font-medium text-foreground">Current theme</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {theme === "system" ? "System preference" : theme === "dark" ? "Dark mode" : "Light mode"}
        </p>
      </div>
    </div>
  );
};

export default AppearanceSettings;