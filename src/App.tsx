import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
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
  const isPublicPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/new-enquiry" element={<ProtectedRoute><NewEnquiry /></ProtectedRoute>} />
        <Route path="/deals" element={<ProtectedRoute><Deals /></ProtectedRoute>} />
        <Route path="/deals/:id" element={<ProtectedRoute><DealDetail /></ProtectedRoute>} />
        <Route path="/compliance" element={<ProtectedRoute><Compliance /></ProtectedRoute>} />
        <Route path="/audit-trail" element={<ProtectedRoute><AuditTrail /></ProtectedRoute>} />
        <Route path="/dashboard/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isPublicPage && <BinderChat />}
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
