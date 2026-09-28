import * as React from "react";
import {
  Button,
  IconButton,
  Typography,
  Collapse,
  Navbar,
  Input,
  Avatar,
  Menu,
} from "@material-tailwind/react";
import {
  Archive,
  HeadsetHelp,
  Home,
  InfoCircle,
  LogOut,
  Menu as MenuIcon,
  // MultiplePages,
  // ProfileCircle,
  Search,
  // SelectFace3d,
  Settings,
  UserCircle,
  Xmark,
} from "iconoir-react";
import { useTheme } from "../context/ThemeContext";
import { Link, NavLink } from "react-router-dom";
import { Moon, ShoppingBasket, Sun } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

const LINKS = [
  {
    icon: Home,
    title: "Home",
    path: "/",
  },
  {
    icon: ShoppingBasket,
    title: "Products",
    path: "/products",
  },
  {
    icon: Archive,
    title: "Categories",
    path: "/categories",
  },
  {
    icon: InfoCircle,
    title: "About",
    path: "/about",
  },
];

function NavList() {
  return (
    <ul className="mt-4 flex flex-col gap-x-3 gap-y-1.5 lg:mt-0 lg:flex-row lg:items-center">
      {LINKS.map(({ icon: Icon, title, path }) => (
        <li key={title}>
          <NavLink
            to={path}
            type="small"
            className={({ isActive }) =>`flex items-center gap-x-2 p-1 ${ isActive ? "text-primary font-semibold" : "hover:text-primary"}`}
          >
            <Icon className="h-4 w-4" />
            {title}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

function ProfileMenu() {
  const dispatch = useDispatch();

  const handleLogOut = () => {
    dispatch(logout())
    localStorage.removeItem('userInfo')
  }
  
  return (
    <Menu>
      <Menu.Trigger
        as={Avatar}
        src="https://raw.githubusercontent.com/creativetimofficial/public-assets/master/ct-assets/team-4.jpg"
        alt="profile-picture"
        size="sm"
        className="border border-primary p-0.5 lg:ml-4"
      />
      <Menu.Content>
        <Menu.Item>
          <UserCircle className="mr-2 h-[18px] w-[18px]" /> My Profile
        </Menu.Item>
        <Menu.Item>
          <Settings className="mr-2 h-[18px] w-[18px]" /> Edit Profile
        </Menu.Item>
        <Menu.Item>
          <HeadsetHelp className="mr-2 h-[18px] w-[18px]" /> Support
        </Menu.Item>
        <hr className="!my-1 -mx-1 border-surface" />
        <Menu.Item onClick={handleLogOut} className="text-error hover:bg-error/10 hover:text-error focus:bg-error/10 focus:text-error">
          <LogOut className="mr-2 h-[18px] w-[18px]" />
          Logout
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
}

export default function SimpleNavbar() {
    const { darkMode, toggleTheme } = useTheme();
  const [openNav, setOpenNav] = React.useState(false);

  const { userInfo } = useSelector((state) => state.auth)

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  return (
    <Navbar className="mx-auto w-full max-w-screen-xl">
      <div className="flex items-center">
        <Typography
          as="a"
          href="#"
          type="small"
          className="ml-2 mr-2 block py-1 font-semibold"
        >
          Material Tailwind
        </Typography>
        <hr className="ml-1 mr-1.5 hidden h-5 w-px border-l border-t-0 border-secondary-dark lg:block" />
        <div className="hidden lg:block">
          <NavList />
          
        </div>
        <div className="ml-auto w-40">
          <Input size="sm" type="search" placeholder="Search here...">
            <Input.Icon>
              <Search className="h-full w-full" />
            </Input.Icon>
          </Input>
        </div>
        {
            (userInfo == null) && 
            <Link to='/login' className="hidden lg:ml-auto lg:inline-block">
                <Button size="sm">Sign In</Button>
            </Link>
        }
        <IconButton
          size="sm"
          variant="ghost"
          color="secondary"
          onClick={() => setOpenNav(!openNav)}
          className="ml-auto grid lg:hidden"
        >
          {openNav ? (
            <Xmark className="h-4 w-4" />
          ) : (
            <MenuIcon className="h-4 w-4" />
          )}
        </IconButton>
        <button
        onClick={toggleTheme}
        className="
          p-2 lg:ml-2
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
        {userInfo && <ProfileMenu />}
      </div>
      <Collapse open={openNav}>
        <NavList />
        <Link to="/login">
            <Button isFullWidth size="sm" className="mt-4">Sign In</Button>
        </Link>
      </Collapse>
    </Navbar>
  );
}
