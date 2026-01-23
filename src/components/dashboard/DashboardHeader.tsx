import { Button } from "@/components/ui/button";
import { Search, Plus, Bell } from "lucide-react";
import { ReactNode } from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function DashboardHeader({ title, subtitle, children }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-background/50 px-8 py-4 backdrop-blur-sm">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {children}
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            className="h-10 w-64 rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Notifications */}
        <button className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
            3
          </span>
        </button>

        {/* Upload Button */}
        <Button variant="hero" size="default">
          <Plus className="h-4 w-4" />
          Upload Deal
        </Button>
      </div>
    </header>
  );
}
