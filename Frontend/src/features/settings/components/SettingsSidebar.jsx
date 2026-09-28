import { Bell, Lock, Palette, Settings2, } from "lucide-react";

const settingsItems = [
  {
    id: "general",
    label: "General",
    description: "Workspace preferences",
    icon: Settings2,
  },
  {
    id: "appearance",
    label: "Appearance",
    description: "Theme and display",
    icon: Palette,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Notification preferences",
    icon: Bell,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and security",
    icon: Lock,
  },
];

const SettingsSidebar = ({ activeSection, onSectionChange, }) => {
  return (
    <div className="space-y-1">
      {settingsItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSectionChange(item.id)}
            className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors 
                ${ isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            <Icon className="mt-0.5 size-4 shrink-0" />

            <div className="min-w-0">
              <p className="text-sm font-medium">{item.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default SettingsSidebar;