import { createContext, useContext, useEffect, useState, } from "react";
const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {return localStorage.getItem("theme") || "system"});

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
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, darkMode: isDark,}}>
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