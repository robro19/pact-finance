import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Onboarding from "./pages/Onboarding";
import Notifications from "./pages/Notifications";
import TenantLayout from "./components/TenantLayout";
import LandlordLayout from "./components/LandlordLayout";
import { RequireAuth } from "./components/RequireAuth";
import Dashboard from "./pages/tenant/Dashboard";
import Verify from "./pages/tenant/Verify";
import History from "./pages/tenant/History";
import LeaseDetails from "./pages/tenant/LeaseDetails";
import Learn from "./pages/tenant/Learn";
import LandlordPortal from "./pages/landlord/LandlordPortal";
import LandlordAbout from "./pages/landlord/LandlordAbout";
import { runMonthlyReminders } from "./lib/store";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    runMonthlyReminders();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/onboarding"
              element={
                <RequireAuth role="tenant">
                  <Onboarding />
                </RequireAuth>
              }
            />

            <Route
              element={
                <RequireAuth role="tenant">
                  <TenantLayout />
                </RequireAuth>
              }
            >
              <Route path="/app" element={<Dashboard />} />
              <Route path="/app/verify" element={<Verify />} />
              <Route path="/app/history" element={<History />} />
              <Route path="/app/lease" element={<LeaseDetails />} />
              <Route path="/app/learn" element={<Learn />} />
              <Route path="/app/notifications" element={<Notifications />} />
            </Route>

            <Route
              element={
                <RequireAuth role="landlord">
                  <LandlordLayout />
                </RequireAuth>
              }
            >
              <Route path="/landlord" element={<LandlordPortal />} />
              <Route path="/landlord/notifications" element={<Notifications />} />
              <Route path="/landlord/about" element={<LandlordAbout />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;