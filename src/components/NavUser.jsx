import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, ChevronRight } from "lucide-react";
import { logout } from "@/features/auth/authSlice";
import { logoutCurrentSession } from "@/services/authService";

const NavUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutCurrentSession();
    } catch (error) {
      if (error.status !== 401) console.error("Server logout failed:", error);
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <div className="border-t bg-background/50 p-3">
      <div className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/60">
        <div className="relative shrink-0">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground shadow-sm">
            RS
          </div>

          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-background bg-emerald-500" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{userInfo?.name || "User"}</p>
          <p className="truncate text-xs text-muted-foreground">{userInfo?.role || "User"}</p>
        </div>

        <ChevronRight className="size-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
      </div>

      <div className="mt-2 space-y-1">
        <button type="button" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Settings className="size-4" />Account Settings
        </button>

        <button type="button" onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10 hover:text-red-600">
          <LogOut className="size-4" />Logout
        </button>
      </div>
    </div>
  );
};

export default NavUser;