import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink, useResolvedPath, useMatch } from "react-router-dom";
import {
  Home,
  Users,
  ShoppingCart,
  LogOut,
  ToyBrick,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import logoSrc from "../assets/toyorbitlogo.png";

const navItems = [
  { title: "Dashboard", to: "/", icon: Home },
  { title: "Customers", to: "/customers", icon: Users },
  { title: "Orders", to: "/orders", icon: ShoppingCart },
  { title: "Products", to: "/products", icon: ToyBrick },
  { title: "Users", to: "/users", icon: User },
];

export function AppSidebar() {
  const { logout } = useAuth();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarContent>
        <SidebarGroup>
          {state === "expanded" && (
            <div className="flex items-center justify-start py-4">
              <img
                src={logoSrc}
                alt="ToyOrbit Manager"
                className="h-20 w-auto"
              />
            </div>
          )}

          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ title, to, icon: Icon }) => {
                const resolved = useResolvedPath(to);
                // if to === '/', only match exactly; otherwise allow prefix matches
                const match = useMatch({
                  path: resolved.pathname,
                  end: to === "/",
                });
                return (
                  <SidebarMenuItem key={title}>
                    {/* asChild must wrap *exactly one* element, with no newlines */}
                    <SidebarMenuButton asChild isActive={!!match}>
                      <NavLink to={to}>
                        <Icon className="h-5 w-5" />
                        <span>{title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}

              <SidebarMenuItem className="mt-5">
                <SidebarMenuButton variant={"destructive"} onClick={logout}>
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
