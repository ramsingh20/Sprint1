import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import SettingsSidebar from "@/features/settings/components/SettingsSidebar";
import GeneralSettings from "@/features/settings/components/GeneralSettings";

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
          {activeSection !== "general" && (
            <div className="flex min-h-[300px] items-center justify-center">
              <p className="text-sm text-muted-foreground">{activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}{" "}
                settings coming next.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Settings;