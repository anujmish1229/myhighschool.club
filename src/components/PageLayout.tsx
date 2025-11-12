import { ReactNode, useMemo } from "react";
import type { CSSProperties } from "react";
import { ClubNavigation } from "./ClubNavigation";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { useConfig } from "@/context/ConfigContext";
import {
  DEFAULT_PRIMARY_HEX,
  createAccentGradient,
  getReadableForegroundHsl,
  hexToHsl,
  resolveHexColor,
} from "@/lib/colors";

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  const { config } = useConfig();

  const themeStyle = useMemo<CSSProperties>(() => {
    const primaryHex = resolveHexColor(config.primaryColor, DEFAULT_PRIMARY_HEX);
    const accentHex = resolveHexColor(config.accentColor, primaryHex);

    const primaryHsl = hexToHsl(primaryHex);
    const accentHsl = hexToHsl(accentHex);

    const style: CSSProperties = {};

    style['--primary' as any] = primaryHsl;
    style['--accent' as any] = accentHsl;
    style['--primary-foreground' as any] = getReadableForegroundHsl(primaryHex);
    style['--accent-foreground' as any] = getReadableForegroundHsl(accentHex);
    style['--gradient-accent' as any] = createAccentGradient(primaryHsl, accentHsl);

    return style;
  }, [config.primaryColor, config.accentColor]);

  return (
    <div className="min-h-screen light-theme bg-white text-gray-900" style={themeStyle}>
      <ClubNavigation />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="pt-20"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

