import { ChartColumn, LayoutDashboard, PersonStanding, Settings, ShoppingCart, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useSelector } from "react-redux";

const sidebarData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    roles: ["Admin", "Manager", "User"],
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: ChartColumn,
    roles: ["Admin", "Manager"],
  },
  {
    title: "Users",
    url: "/dashboard/users",
    icon: Users,
    roles: ["Admin"],
  },
  {
    title: "Reports",
    url: "/dashboard/reports",
    icon: ShoppingCart,
    roles: ["Admin", "Manager"],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
    roles: ["Admin", "Manager"],
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: PersonStanding,
    roles: ["Admin", "Manager", "User"],
  },
];
const NavMain = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const visibleItems = sidebarData.filter((item) => item.roles.includes(userInfo?.role));
  
  return (
    <SidebarGroup>
      <SidebarMenu>

        {visibleItems.map((item) => (
          <SidebarMenuItem key={item.title}>

            <SidebarMenuButton
                render={<NavLink to={item.url} />}>
                <item.icon />
                <span>{item.title}</span>
            </SidebarMenuButton>

          </SidebarMenuItem>
        ))}

      </SidebarMenu>
    </SidebarGroup>
  );
};

export default NavMain;