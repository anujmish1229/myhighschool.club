import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import RotatingEarth from "./RotatingEarth";
import SchoolSearch from "./SchoolSearch";
import { Button } from "./ui/button";
import { LockKey } from "@phosphor-icons/react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Earth */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <RotatingEarth />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto relative z-20"
        >
          {/* Hook */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            Transform Your School's{" "}
            <span className="text-gradient">Digital Presence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-foreground/70 mb-12"
          >
            AI-powered websites that bring your school clubs to life 
          </motion.p> 

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-4 relative z-30"
          >
            <SchoolSearch />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-foreground/50 text-sm mb-8"
          >
            Find your Ontario high school
          </motion.p>

          {/* Admin Login Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="relative z-30"
          >
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              size="lg"
              className="gap-2"
            >
              <LockKey size={20} weight="duotone" />
              Admin Login
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
    </section>
  );
};

export default Hero;
