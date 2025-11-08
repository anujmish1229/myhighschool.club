import { useState, useEffect } from "react";
import { NavLink } from "./NavLink";
import { List, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { useConfig } from "@/context/ConfigContext";
import { useParams } from "react-router-dom";

const navItems = [
  { name: "Home", path: "" },
  { name: "About", path: "about" },
  { name: "Our Team", path: "team" },
  { name: "Gallery", path: "gallery" },
  { name: "FAQ", path: "faq" },
  { name: "Announcements", path: "announcements" },
];

export const ClubNavigation = () => {
  const { config } = useConfig();
  const { schoolSlug, clubSlug } = useParams<{ schoolSlug: string; clubSlug: string }>();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const basePath = `/${schoolSlug}/${clubSlug}`;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-card border-b"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <NavLink to={basePath} className="text-xl font-medium">
              {config.clubName.split(' ')[0]}<span className="text-primary">{config.clubTagline || config.clubName.split(' ').slice(1).join(' ')}</span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path ? `${basePath}/${item.path}` : basePath}
                  end={item.path === ""}
                  className="text-sm text-foreground/80 hover:text-primary transition-colors"
                  activeClassName="text-primary font-medium"
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-foreground hover:text-primary transition-colors"
              aria-label="Open menu"
            >
              <List size={28} weight="light" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Tray */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 glass-card border-l z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <span className="text-xl font-medium">Menu</span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-foreground hover:text-primary transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={28} weight="light" />
                  </button>
                </div>
                <div className="flex flex-col gap-2 p-6">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path ? `${basePath}/${item.path}` : basePath}
                      end={item.path === ""}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg text-foreground/80 hover:text-primary transition-colors py-3"
                      activeClassName="text-primary font-medium"
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

