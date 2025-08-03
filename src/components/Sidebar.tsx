import {
  Sidebar,
  SidebarContent,
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
import logoSrc from "../assets/toyorbitlogo.png";
import { Button } from "./ui/button";

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
          <div className="flex items-center justify-start py-4">
            <img src={logoSrc} alt="ToyOrbit Manager" className="h-20 w-auto" />
          </div>
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
                         hover:bg-accent/10 text-lg
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

              <SidebarMenuItem className="mt-5">
                {
                  <Button variant={"destructive"} size={"lg"} onClick={logout}>
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                }
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
