import { ChartColumn, LayoutDashboard, PersonStanding, Settings, ShoppingCart, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

const sidebarData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartColumn,
  },
  {
    title: "Users",
    url: "/users",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: ShoppingCart,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: PersonStanding,
  },
];
const NavMain = () => {
  return (
    <SidebarGroup>
      <SidebarMenu>

        {sidebarData.map((item) => (
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