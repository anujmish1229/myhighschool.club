import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ConfigProvider, useConfig } from "@/context/ConfigContext";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect, useMemo } from "react";
import Index from "./pages/Index";
import SchoolHome from "./pages/SchoolHome";
import ClubWebsite from "./pages/ClubWebsite";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EditSchool from "./pages/EditSchool";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Helper function to convert hex to HSL
const hexToHsl = (hex: string): string => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lightness = Math.round(l * 100);

  return `${h} ${s}% ${lightness}%`;
};

// Component to apply dynamic colors
const DEFAULT_PRIMARY_HEX = '#3b82f6';
const DEFAULT_ACCENT_HEX = '#8b5cf6';

const ColorThemeApplier = () => {
  const { config } = useConfig();
  const location = useLocation();

  const isClubRoute = useMemo(() => /^\/[^/]+\/[^/]+/.test(location.pathname), [location.pathname]);

  useEffect(() => {
    // Convert hex to HSL and apply
    try {
      const primaryHex = isClubRoute ? config.primaryColor : DEFAULT_PRIMARY_HEX;
      const accentHex = isClubRoute ? config.accentColor : DEFAULT_ACCENT_HEX;

      const primaryHsl = hexToHsl(primaryHex);
      const accentHsl = hexToHsl(accentHex);
      
      document.documentElement.style.setProperty('--primary', primaryHsl);
      document.documentElement.style.setProperty('--accent', accentHsl);
    } catch (e) {
      // Fallback to default if conversion fails
      console.error('Error converting colors:', e);
      document.documentElement.style.setProperty('--primary', hexToHsl(DEFAULT_PRIMARY_HEX));
      document.documentElement.style.setProperty('--accent', hexToHsl(DEFAULT_ACCENT_HEX));
    }
  }, [config.primaryColor, config.accentColor, isClubRoute]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ConfigProvider>
        <TooltipProvider>
          <BrowserRouter>
            <ColorThemeApplier />
            <Toaster />
            <Sonner />
            <Routes>
              {/* Main Landing Page */}
              <Route path="/" element={<Index />} />
              
              {/* Authentication & Admin Routes */}
              <Route path="/login" element={<Login />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/edit/:schoolSlug/:clubSlug" 
                element={
                  <ProtectedRoute>
                    <EditSchool />
                  </ProtectedRoute>
                } 
              />
              
              {/* Dynamic Club Pages (nested under school) */}
              <Route path="/:schoolSlug/:clubSlug/*" element={<ClubWebsite />} />

              {/* Dynamic High School Pages */}
              <Route path="/:schoolSlug" element={<SchoolHome />} />
              
              {/* Fallback */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ConfigProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
