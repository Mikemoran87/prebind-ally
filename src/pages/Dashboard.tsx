import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { AuditLog } from "@/components/dashboard/AuditLog";
import { EmailSync } from "@/components/dashboard/EmailSync";
import { DealList } from "@/components/dashboard/DealList";
import { BinderChat } from "@/components/dashboard/BinderChat";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64">
        <DashboardHeader 
          title="Dashboard" 
          subtitle="Welcome back, Jane. Here's your risk governance overview."
        >
          <EmailSync />
        </DashboardHeader>
        
        <div className="p-8">
          {/* Stats */}
          <StatsCards />

          {/* Main Content Grid */}
          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Deals - Takes 2 columns */}
            <div className="lg:col-span-2">
              <DealList />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <ComplianceChart />
              <AuditLog />
            </div>
          </div>
        </div>
      </main>

      <BinderChat />
    </div>
  );
}
