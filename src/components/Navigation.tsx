import { useEffect, useState } from "react";
import { List, X } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const homeNavLinks = [
    { name: "Home", path: "#home" },
    { name: "About", path: "#about" },
    { name: "FAQ", path: "#faq" },
    { name: "Contact", path: "#contact" },
  ];

  const schoolNavLinks = [
    { name: "Home", path: "#home" },
    { name: "Clubs", path: "#clubs" },
    { name: "Events", path: "#events" },
    { name: "Resources", path: "#resources" },
  ];

  const navLinks = isHomePage ? homeNavLinks : schoolNavLinks;

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const scrollToSection = (hash: string) => {
    setIsOpen(false);
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (!isHomePage) {
      navigate("/");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href={isHomePage ? "#home" : "/"}
            onClick={(e) => {
              e.preventDefault();
              if (isHomePage) {
                scrollToSection("#home");
              } else {
                navigate("/");
              }
            }}
            className="text-2xl font-semibold text-gradient cursor-pointer"
          >
            SchoolHub AI
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.path);
                }}
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 cursor-pointer"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} weight="light" /> : <List size={24} weight="light" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Tray */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden"
              style={{ top: "72px" }}
            />

            {/* Tray */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-[72px] bottom-0 w-64 glass md:hidden"
            >
              <div className="flex flex-col gap-6 p-8">
                {navLinks.map((link) => (
                  <a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.path);
                    }}
                    className="text-foreground/80 hover:text-foreground transition-colors duration-200 text-lg cursor-pointer"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
