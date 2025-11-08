import { ReactNode } from "react";
import { ClubNavigation } from "./ClubNavigation";
import Footer from "./Footer";
import { motion } from "framer-motion";

interface PageLayoutProps {
  children: ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen light-theme bg-white text-gray-900">
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

