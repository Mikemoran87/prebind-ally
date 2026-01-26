import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Deals from "./pages/Deals";
import DealDetail from "./pages/DealDetail";
import Compliance from "./pages/Compliance";
import AuditTrail from "./pages/AuditTrail";
import Upload from "./pages/Upload";
import NewEnquiry from "./pages/NewEnquiry";
import NotFound from "./pages/NotFound";
import { BinderChat } from "./components/dashboard/BinderChat";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/new-enquiry" element={<NewEnquiry />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/deals/:id" element={<DealDetail />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/audit-trail" element={<AuditTrail />} />
        <Route path="/dashboard/upload" element={<Upload />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isLandingPage && <BinderChat />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
