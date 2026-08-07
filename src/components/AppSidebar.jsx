import Logo from "./Logo";
import NavMain from "./NavMain";
import NavUser from "./NavUser";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "./ui/sidebar";

const AppSidebar = () => {
  return (
    <Sidebar>

      <SidebarHeader>
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <NavMain />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

    </Sidebar>
  );
};

export default AppSidebar;