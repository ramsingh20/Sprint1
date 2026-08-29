import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import SettingsSidebar from "@/features/settings/components/SettingsSidebar";
import GeneralSettings from "@/features/settings/components/GeneralSettings";
import AppearanceSettings from "@/features/settings/components/AppearanceSettings";
import NotificationSettings from "@/features/settings/components/NotificationSettings";
import SecuritySettings from "@/features/settings/components/SecuritySettings";

const Settings = () => {
  const [activeSection, setActiveSection] = useState("general");

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account preferences and application settings." />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-xl border border-border bg-card p-3">
          <SettingsSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        </aside>

        <section className="min-w-0 rounded-xl border border-border bg-card p-6">
          {activeSection === "general" && (<GeneralSettings />)}
          {activeSection === "appearance" && (<AppearanceSettings />)}
          {activeSection === "notifications" && (<NotificationSettings />)}
          {activeSection === "security" && (<SecuritySettings />)}
        </section>
      </div>
    </div>
  );
};

export default Settings;






// {!["general", "appearance", "notifications",].includes(activeSection) && (
//   <div className="flex min-h-[300px] items-center justify-center">
//     <p className="text-sm text-muted-foreground">Security settings coming next.</p>
//   </div>
// )}