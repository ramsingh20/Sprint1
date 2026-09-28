import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getCurrentUser } from "@/services/authService";
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "system");
  const [themeLoadedForUser, setThemeLoadedForUser] = useState(null);
  const isThemeLoading = Boolean(userInfo) && themeLoadedForUser !== userInfo;

  useEffect(() => {
    let active = true;
    const loadSavedTheme = async () => {
      if (!userInfo) return;
      try {
        const { user } = await getCurrentUser();
        if (active && ["light", "dark", "system"].includes(user?.appearancePreference)) {
          setTheme(user.appearancePreference);
        }
      } catch (error) {
        if (active) console.error("Failed to load saved appearance preference:", error);
      } finally {
        if (active) setThemeLoadedForUser(userInfo);
      }
    };
    loadSavedTheme();
    return () => { active = false; };
  }, [userInfo]);

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (currentTheme) => {
      const isDark = currentTheme === "dark" ||
        (currentTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.classList.toggle("dark", isDark);
    };

    applyTheme(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      document.documentElement.classList.toggle("dark", mediaQuery.matches);
    };
    mediaQuery.addEventListener("change", handleChange);

    return () => { mediaQuery.removeEventListener("change", handleChange)};
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, darkMode: isDark, isThemeLoading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
};