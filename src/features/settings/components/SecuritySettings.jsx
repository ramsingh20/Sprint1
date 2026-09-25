import { useEffect, useState } from "react";
import { changePassword } from "@/services/authService";
import { Eye, EyeOff, KeyRound, Monitor, ShieldCheck, Smartphone, LogOut } from "lucide-react";
import { getSessions, revokeOtherSessions, revokeSession } from "@/services/authService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const SecuritySettings = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [sessionAction, setSessionAction] = useState("");

  useEffect(() => {
    let active = true;
    const loadSessions = async () => {
      try {
        const { sessions: currentSessions } = await getSessions();
        if (active) setSessions(currentSessions);
      } catch (error) {
        if (active) toast.error(error.message || "Failed to load active sessions.");
      } finally {
        if (active) setIsLoadingSessions(false);
      }
    };
    loadSessions();
    return () => { active = false; };
  }, []);

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;

    setPasswords((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!passwords.current) {
      toast.error("Please enter your current password.");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.newPassword,
      });
      setPasswords({ current: "", newPassword: "", confirmPassword: "" });
      toast.success("Password updated successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to update password.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleTwoFactorToggle = () => {
    const nextValue = !twoFactorEnabled;
    setTwoFactorEnabled(nextValue);

    toast.success(nextValue ? "Two-factor authentication enabled." : "Two-factor authentication disabled.");
  };

  const handleSignOutSession = async (sessionId) => {
    try {
      setSessionAction(sessionId);
      await revokeSession(sessionId);
      setSessions((current) => current.filter((session) => session.id !== sessionId));
      toast.success("Session signed out successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to sign out session.");
    } finally {
      setSessionAction("");
    }
  };

  const handleSignOutOthers = async () => {
    try {
      setSessionAction("others");
      await revokeOtherSessions();
      setSessions((current) => current.filter((session) => session.current));
      toast.success("Other sessions have been signed out.");
    } catch (error) {
      toast.error(error.message || "Failed to sign out other sessions.");
    } finally {
      setSessionAction("");
    }
  };

  const passwordInputClass = "h-10 w-full rounded-md border border-input bg-background px-3 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          <ShieldCheck className="size-5" />Security
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage your password, authentication and active sessions.</p>
      </div>
      <section className="overflow-hidden rounded-xl border border-border">
        <div className="flex items-start gap-3 border-b border-border bg-muted/30 p-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-background text-muted-foreground">
            <KeyRound className="size-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Change Password</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Update your account password regularly to keep
              your account secure.
            </p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-5 p-5">
          <div className="space-y-2">
            <label htmlFor="current" className="text-sm font-medium text-foreground">Current Password</label>

            <div className="relative">
              <input
                id="current"
                name="current"
                type={showCurrentPassword? "text": "password"}
                value={passwords.current}
                onChange={handlePasswordChange}
                className={passwordInputClass}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() =>setShowCurrentPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? (<EyeOff className="size-4" />) : (<Eye className="size-4" />)}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</label>
            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showNewPassword? "text": "password"}
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className={passwordInputClass}
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() =>setShowNewPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showNewPassword ? "Hide password": "Show password"}
              >
                {showNewPassword ? (<EyeOff className="size-4" />) : (<Eye className="size-4" />)}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Use at least 8 characters.</p>
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm New Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwords.confirmPassword}
                onChange={handlePasswordChange}
                className={passwordInputClass}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() =>setShowConfirmPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (<EyeOff className="size-4" />) : (<Eye className="size-4" />)}
              </button>
            </div>
          </div>
          <div className="flex justify-end border-t border-border pt-5">
            <Button type="submit" disabled={isChangingPassword}>{isChangingPassword ? "Changing Password..." : "Change Password"}</Button>
          </div>
        </form>
      </section>

      {/* 2FA */}
      <section className="rounded-xl border border-border">
        <div className="flex items-center justify-between gap-6 p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Two-Factor Authentication</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add an additional layer of security to your
                account.
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={twoFactorEnabled}
            onClick={handleTwoFactorToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${twoFactorEnabled ? "bg-primary" : "bg-muted"}`}
          >
            <span className={`pointer-events-none absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform ${twoFactorEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
          </button>
        </div>
      </section>
      <section className="overflow-hidden rounded-xl border border-border">
        <div className="flex flex-col gap-3 border-b border-border bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Active Sessions</h3>
            <p className="mt-1 text-xs text-muted-foreground">Manage devices currently signed into your account.</p>
          </div>
          {sessions.some((session) => !session.current) && (
            <Button type="button" variant="outline" size="sm" onClick={handleSignOutOthers} disabled={Boolean(sessionAction)} className="gap-2">
              <LogOut className="size-4" />{sessionAction === "others" ? "Signing out..." : "Sign Out Others"}
            </Button>
          )}
        </div>
        {isLoadingSessions ? (
          <p role="status" className="p-5 text-sm text-muted-foreground">Loading active sessions...</p>
        ) : sessions.length === 0 ? (
          <p className="p-5 text-sm text-muted-foreground">No active sessions found.</p>
        ) : (
          <div className="divide-y divide-border">
            {sessions.map((session) => {
              const isMobile = /Mobile|Android|iPhone|iPad/i.test(session.userAgent || "");
              const Icon = isMobile ? Smartphone : Monitor;
              return (
                <div key={session.id} className="flex items-center justify-between gap-4 p-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Icon className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">{session.userAgent || "Unknown device"}</p>
                        {session.current && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">Current</span>}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Last active {new Date(session.lastActiveAt).toLocaleString()}</p>
                    </div>
                  </div>
                  {!session.current && (
                    <Button type="button" variant="ghost" size="sm" disabled={Boolean(sessionAction)} onClick={() => handleSignOutSession(session.id)}>
                      {sessionAction === session.id ? "Signing out..." : "Sign out"}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
      {/* Frontend disclaimer */}
      <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4">
        <p className="text-xs leading-5 text-muted-foreground">
Session management and password changes are connected to the secure backend. Two-factor authentication remains a demo-only control.
        </p>
      </div>
    </div>
  );
};

export default SecuritySettings;