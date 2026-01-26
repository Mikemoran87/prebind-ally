import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  Upload,
  Bell,
  PlusCircle,
} from "lucide-react";
import prebindLogo from "@/assets/prebind-logo.png";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Enquiry", href: "/dashboard/new-enquiry", icon: PlusCircle },
  { name: "Deals", href: "/deals", icon: FileText },
  { name: "Upload", href: "/dashboard/upload", icon: Upload },
  { name: "Binder Compliance", href: "/compliance", icon: ShieldCheck },
  { name: "Audit Trail", href: "/audit-trail", icon: History },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const secondary = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link to="/">
          <img src={prebindLogo} alt="PreBind" className="h-8" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Main
        </div>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
              {item.name}
            </Link>
          );
        })}

        <div className="mb-2 mt-8 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Settings
        </div>
        {secondary.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-cyan-400 font-semibold text-primary-foreground">
            JD
          </div>
          <div className="flex-1 truncate">
            <div className="text-sm font-medium text-sidebar-foreground">
              Jane Doe
            </div>
            <div className="text-xs text-muted-foreground">
              Senior Underwriter
            </div>
          </div>
          <button className="relative">
            <Bell className="h-5 w-5 text-muted-foreground hover:text-sidebar-foreground" />
            <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-primary" />
          </button>
        </div>
      </div>
    </aside>
  );
}
