import * as React from "react";
import {
  Button,
  IconButton,
  Typography,
  Collapse,
  Navbar,
  Input,
} from "@material-tailwind/react";
import {
  Home,
  InfoCircle,
  Menu as MenuIcon,
  Search,
  Xmark,
  Spark,
} from "iconoir-react";
import { Link } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useSelector } from "react-redux";

const LINKS = [
  { icon: Home, title: "Overview", href: "#overview" },
  { icon: Spark, title: "Features", href: "#features" },
  { icon: Spark, title: "Modules", href: "#modules" },
  { icon: InfoCircle, title: "About", href: "#about" },
];

function NavList({ mobile = false, onNavigate }) {
  return (
    <ul
      className={
        mobile
          ? "mt-4 flex flex-col gap-y-2"
          : "flex items-center gap-x-5"
      }
    >
      {LINKS.map(({ icon: Icon, title, href }) => (
        <li key={title}>
          <a
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-x-2 transition-colors ${
              mobile
                ? "rounded-lg px-3 py-2 hover:bg-surface-container"
                : "p-1 hover:text-primary"
            }`}
          >
            <Icon className="h-4 w-4" />
            {title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function SimpleNavbar() {
  const { darkMode, toggleTheme } = useTheme();
  const [openNav, setOpenNav] = React.useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const closeMobileNav = () => setOpenNav(false);

  return (
    <Navbar className="mx-auto w-full max-w-screen-xl border border-surface/60">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          onClick={closeMobileNav}
          className="shrink-0"
          aria-label="PulseBoard home"
        >
          <Typography
            as="span"
            type="small"
            className="block py-1 text-base font-bold tracking-tight"
          >
            Pulse<span className="text-primary">Board</span>
          </Typography>
        </Link>

        <hr className="ml-1 mr-1.5 hidden h-5 w-px border-l border-t-0 border-secondary-dark lg:block" />

        <div className="hidden lg:block">
          <NavList />
        </div>

        <div className="ml-auto w-36 sm:w-44">
          <Input size="sm" type="search" placeholder="Search here...">
            <Input.Icon>
              <Search className="h-full w-full" />
            </Input.Icon>
          </Input>
        </div>

        <button
          onClick={toggleTheme}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded-lg p-2 transition hover:bg-gray-100 dark:hover:bg-slate-800"
        >
          {darkMode ? (
            <Sun className="text-yellow-400" size={21} />
          ) : (
            <Moon className="text-slate-700" size={21} />
          )}
        </button>

        <div className="hidden items-center gap-2 lg:flex">
          {userInfo ? (
            <Link to="/dashboard">
              <Button size="sm">Open Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>

        <IconButton
          size="sm"
          variant="ghost"
          color="secondary"
          onClick={() => setOpenNav((value) => !value)}
          className="grid lg:hidden"
          aria-label={openNav ? "Close navigation" : "Open navigation"}
        >
          {openNav ? (
            <Xmark className="h-4 w-4" />
          ) : (
            <MenuIcon className="h-4 w-4" />
          )}
        </IconButton>
      </div>

      <Collapse open={openNav}>
        <NavList mobile onNavigate={closeMobileNav} />

        <div className="mt-4 flex flex-col gap-2 pb-2">
          {userInfo ? (
            <Link to="/dashboard" onClick={closeMobileNav}>
              <Button isFullWidth size="sm">
                Open Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/login" onClick={closeMobileNav}>
                <Button isFullWidth size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link to="/register" onClick={closeMobileNav}>
                <Button isFullWidth size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </Collapse>
    </Navbar>
  );
}
