
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ListProperty from "./pages/ListProperty";
import FindRoom from "./pages/FindRoom";
import Dashboard from "./pages/Dashboard";
import PropertyDetails from "./pages/PropertyDetails";
import Inquiries from "./pages/Inquiries";
import Help from "./pages/Help";
import Safety from "./pages/Safety";
import About from "./pages/About";
import TermsAndConditions from "./pages/TermsAndConditions";
import ListingPolicy from "./pages/ListingPolicy";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/list-property" element={<ListProperty />} />
            <Route path="/find-room" element={<FindRoom />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/inquiries" element={<Inquiries />} />
            <Route path="/help" element={<Help />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/listing-policy" element={<ListingPolicy />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
