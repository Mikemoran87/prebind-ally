import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { EmailSync } from "@/components/dashboard/EmailSync";
import { DealList } from "@/components/dashboard/DealList";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { session } = useAuth();
  const userName = session?.user?.email?.split('@')[0] || 'Underwriter';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="ml-64">
        <DashboardHeader 
          title="Dashboard" 
          subtitle={`Welcome back, ${userName}. Here's your risk governance overview.`}
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
