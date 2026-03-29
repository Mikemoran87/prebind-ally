import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export function StatsCards() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ total: 0, compliant: 0, flagged: 0, pending: 0 });

  useEffect(() => {
    async function fetchCounts() {
      const { data } = await supabase.from('deals').select('overall_risk_score, status');
      if (data) {
        setCounts({
          total: data.length,
          compliant: data.filter(d => !d.overall_risk_score || d.overall_risk_score < 50).length,
          flagged: data.filter(d => d.overall_risk_score !== null && d.overall_risk_score >= 50).length,
          pending: data.filter(d => d.status === 'new' || d.status === 'in_review').length,
        });
      }
    }
    fetchCounts();
  }, []);

  const stats = [
    {
      title: "Total Deals",
      value: String(counts.total),
      icon: FileText,
      iconColor: "text-primary",
      iconBg: "bg-primary/10",
      link: "/deals",
    },
    {
      title: "Compliant",
      value: String(counts.compliant),
      icon: CheckCircle,
      iconColor: "text-success",
      iconBg: "bg-success/10",
      link: null,
    },
    {
      title: "Flagged",
      value: String(counts.flagged),
      icon: AlertTriangle,
      iconColor: "text-warning",
      iconBg: "bg-warning/10",
      link: counts.flagged > 0 ? "/compliance" : null,
    },
    {
      title: "Pending Review",
      value: String(counts.pending),
      icon: Clock,
      iconColor: "text-muted-foreground",
      iconBg: "bg-muted",
      link: null,
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          onClick={() => stat.link && navigate(stat.link)}
          className={cn(
            "glass-card p-6 transition-all duration-300 hover:border-primary/30",
            stat.link && "cursor-pointer hover:scale-[1.02]"
          )}
        >
          <div className="flex items-center justify-between">
            <div className={cn("rounded-xl p-3", stat.iconBg)}>
              <stat.icon className={cn("h-6 w-6", stat.iconColor)} />
            </div>
          </div>
          <div className="mt-4">
            <div className="font-display text-3xl font-bold text-foreground">{stat.value}</div>
            <div className="mt-1 text-sm text-muted-foreground">{stat.title}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
