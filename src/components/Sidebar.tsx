import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router-dom";
import { Home, Users, ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { title: "Dashboard", to: "/", icon: Home },
  { title: "Customers", to: "/customers", icon: Users },
  { title: "Orders", to: "/orders", icon: ShoppingCart },
];

export function AppSidebar() {
  const { logout } = useAuth();
  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ title, to, icon: Icon }) => (
                <SidebarMenuItem key={title}>
                  {/* asChild must wrap *exactly one* element, with no newlines */}
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-2 py-1 rounded-md transition-colors
                         hover:bg-accent/10
                         ${
                           isActive
                             ? "bg-accent text-accent-foreground"
                             : "text-foreground"
                         }`
                      }
                    >
                      <Icon className="h-5 w-5" />
                      <span>{title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              {
                <button
                  onClick={logout}
                  className="flex w-full items-center space-x-2 px-2 py-1 rounded-md transition-colors text-foreground hover:bg-accent/10"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              }
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
