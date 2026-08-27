import { useState } from "react";
import { Bell, Mail, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const defaultPreferences = {
  orderUpdates: true,
  customerActivity: true,
  weeklyReports: false,
  securityAlerts: true,
  loginAlerts: true,
};

const notificationGroups = [
  {
    title: "Email Notifications",
    description: "Choose which business updates you want to receive.",
    icon: Mail,
    items: [
      {
        key: "orderUpdates",
        title: "Order Updates",
        description: "Receive notifications about new and updated orders.",
      },
      {
        key: "customerActivity",
        title: "Customer Activity",
        description: "Get notified when customers interact with your business.",
      },
      {
        key: "weeklyReports",
        title: "Weekly Reports",
        description: "Receive a weekly summary of your business performance.",
      },
    ],
  },
  {
    title: "Security Notifications",
    description: "Stay informed about important account activity.",
    icon: Shield,
    items: [
      {
        key: "securityAlerts",
        title: "Security Alerts",
        description: "Get notified about important security events.",
      },
      {
        key: "loginAlerts",
        title: "Login Alerts",
        description: "Receive an alert when your account is accessed.",
      },
    ],
  },
];

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState(() => {
    const savedPreferences = localStorage.getItem("notification-preferences");

    return savedPreferences ? JSON.parse(savedPreferences) : defaultPreferences;
  });

  const [savedPreferences, setSavedPreferences] = useState(preferences);

  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(savedPreferences);

  const handleToggle = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const handleSave = () => {
    localStorage.setItem("notification-preferences", JSON.stringify(preferences));

    setSavedPreferences(preferences);
    toast.success("Notification preferences updated successfully.");
  };

  const handleReset = () => {
    setPreferences(savedPreferences);
    toast.info("Notification changes have been reset.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <Bell className="size-5" />Notifications
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">Manage how and when you receive notifications.</p>
      </div>

      <div className="space-y-6">
        {notificationGroups.map((group) => {
          const Icon = group.icon;

          return (
            <div key={group.title} className="overflow-hidden rounded-xl border border-border">
              <div className="flex items-start gap-3 border-b border-border bg-muted/30 p-5">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background text-muted-foreground">
                  <Icon className="size-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{group.description}</p>
                </div>
              </div>

              <div className="divide-y divide-border">
                {group.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between gap-6 p-5">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>

                    {/* Switch */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={preferences[item.key]}
                      aria-label={`Toggle ${item.title}`}
                      onClick={() =>handleToggle(item.key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                        preferences[item.key] ? "bg-primary" : "bg-muted"}`}
                    >
                      <span className={`pointer-events-none absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform ${
                          preferences[item.key] ? "translate-x-5" : "translate-x-0.5"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={!hasChanges} onClick={handleReset}>Reset</Button>
        <Button type="button" disabled={!hasChanges} onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default NotificationSettings;