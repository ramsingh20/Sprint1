import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav
      className="
      flex
      justify-between
      items-center
      px-6
      py-4
      border-b
      bg-white
      dark:bg-slate-900
      dark:border-slate-700
      "
    >
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">
        Alpha App
      </h1>

      <button
        onClick={toggleTheme}
        className="
          p-2
          rounded-lg
          hover:bg-gray-100
          dark:hover:bg-slate-800
          transition
        "
      >
        {darkMode ? (
          <Sun className="text-yellow-400" size={22} />
        ) : (
          <Moon className="text-slate-700" size={22} />
        )}
      </button>
    </nav>
  );
};

export default Navbar;