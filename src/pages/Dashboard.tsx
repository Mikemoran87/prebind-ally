import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { RecentDeals } from "@/components/dashboard/RecentDeals";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { AuditLog } from "@/components/dashboard/AuditLog";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64">
        <DashboardHeader 
          title="Dashboard" 
          subtitle="Welcome back, Jane. Here's your governance overview."
        />
        
        <div className="p-8">
          {/* Stats */}
          <StatsCards />

          {/* Main Content Grid */}
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Recent Deals - Takes 2 columns */}
            <div className="lg:col-span-2">
              <RecentDeals />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <ComplianceChart />
              <AuditLog />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
