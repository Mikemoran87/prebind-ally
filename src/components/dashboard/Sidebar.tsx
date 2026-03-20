import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  History,
  HelpCircle,
  Upload,
  Bell,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import prebindLogo from "@/assets/prebind-logo.png";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Enquiry", href: "/dashboard/new-enquiry", icon: PlusCircle, highlight: true, badge: 1 },
  { name: "Deals", href: "/deals", icon: FileText },
  { name: "Upload", href: "/dashboard/upload", icon: Upload },
  { name: "Binder Compliance", href: "/compliance", icon: ShieldCheck },
  { name: "Audit Trail", href: "/audit-trail", icon: History },
];

const secondary = [
  { name: "Help & Support", href: "mailto:contact@prebind.com", icon: HelpCircle, isExternal: true },
];

export function Sidebar() {
  const location = useLocation();
  const [hasVisitedEnquiry, setHasVisitedEnquiry] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("hasVisitedNewEnquiry") === "true";
    setHasVisitedEnquiry(visited);
  }, [location.pathname]);
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-32 items-center border-b border-border px-2">
        <Link to="/">
          <img src={prebindLogo} alt="PreBind" className="h-28 w-auto" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Main
        </div>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const showHighlight = 'highlight' in item && item.highlight && !hasVisitedEnquiry;
          const showBadge = 'badge' in item && item.badge && !hasVisitedEnquiry ? item.badge : null;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                showHighlight && !isActive && "bg-primary/10 border border-primary/30 text-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5", (isActive || showHighlight) && "text-primary")} />
              <span className="flex-1">{item.name}</span>
              {showBadge !== null && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {showBadge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="mb-2 mt-8 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Settings
        </div>
        {secondary.map((item) => {
          if (item.isExternal) {
            return (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </a>
            );
          }
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
