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
import PrivacyPolicy from "./pages/PrivacyPolicy";
import {
  DEFAULT_ACCENT_HEX,
  DEFAULT_PRIMARY_HEX,
  createAccentGradient,
  getReadableForegroundHsl,
  hexToHsl,
  resolveHexColor,
} from "@/lib/colors";

const queryClient = new QueryClient();

const ColorThemeApplier = () => {
  const { config } = useConfig();
  const location = useLocation();

  const isClubRoute = useMemo(() => /^\/[^/]+\/[^/]+/.test(location.pathname), [location.pathname]);

  useEffect(() => {
    // Convert hex to HSL and apply
    try {
      const primaryHex = resolveHexColor(isClubRoute ? config.primaryColor : undefined, DEFAULT_PRIMARY_HEX);
      const accentFallback = isClubRoute ? primaryHex : DEFAULT_ACCENT_HEX;
      const accentHex = resolveHexColor(isClubRoute ? config.accentColor : undefined, accentFallback);

      const primaryHsl = hexToHsl(primaryHex);
      const accentHsl = hexToHsl(accentHex);
      
      document.documentElement.style.setProperty('--primary', primaryHsl);
      document.documentElement.style.setProperty('--accent', accentHsl);
      document.documentElement.style.setProperty('--primary-foreground', getReadableForegroundHsl(primaryHex));
      document.documentElement.style.setProperty('--accent-foreground', getReadableForegroundHsl(accentHex));
      document.documentElement.style.setProperty('--gradient-accent', createAccentGradient(primaryHsl, accentHsl));
    } catch (e) {
      // Fallback to default if conversion fails
      console.error('Error converting colors:', e);
      document.documentElement.style.setProperty('--primary', hexToHsl(DEFAULT_PRIMARY_HEX));
      document.documentElement.style.setProperty('--accent', hexToHsl(DEFAULT_ACCENT_HEX));
      document.documentElement.style.setProperty('--primary-foreground', getReadableForegroundHsl(DEFAULT_PRIMARY_HEX));
      document.documentElement.style.setProperty('--accent-foreground', getReadableForegroundHsl(DEFAULT_ACCENT_HEX));
      document.documentElement.style.setProperty(
        '--gradient-accent',
        createAccentGradient(hexToHsl(DEFAULT_PRIMARY_HEX), hexToHsl(DEFAULT_ACCENT_HEX)),
      );
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
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              
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
              <Route 
                path="/setup/:schoolSlug/:clubSlug" 
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
