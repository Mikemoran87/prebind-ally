import { Button } from "@/components/ui/button";
import { Plus, Bell, RotateCcw } from "lucide-react";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function DashboardHeader({ title, subtitle, children }: DashboardHeaderProps) {
  const navigate = useNavigate();
  const [hasNotification, setHasNotification] = useState(true);

  const handleNotificationClick = () => {
    setHasNotification(false);
    navigate("/dashboard/new-enquiry");
  };

  const handleResetDemo = async () => {
    // Delete the demo deal if it was created
    const demoDealId = localStorage.getItem("demoDealId");
    if (demoDealId) {
      await supabase.from("deals").delete().eq("id", demoDealId);
    }
    
    localStorage.removeItem("hasVisitedNewEnquiry");
    localStorage.removeItem("demoDealId");
    window.location.reload();
  };

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

        {/* Reset Demo Button */}
        <button
          onClick={handleResetDemo}
          className="flex h-10 items-center gap-2 rounded-lg border border-border bg-secondary px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Reset Demo
        </button>

        {/* Notifications */}
        <button
          onClick={handleNotificationClick}
          className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          {hasNotification && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              1
            </span>
          )}
        </button>

        {/* Upload Button */}
        <Button variant="hero" size="default" onClick={() => navigate("/dashboard/upload")}>
          <Plus className="h-4 w-4" />
          Upload Deal
        </Button>
      </div>
    </header>
  );
}
