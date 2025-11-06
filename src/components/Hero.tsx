import { useState } from "react";
import { MagnifyingGlass } from "phosphor-react";
import { motion } from "framer-motion";
import RotatingEarth from "./RotatingEarth";
import { Button } from "./ui/button";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Earth */}
      <div className="absolute inset-0 opacity-20">
        <RotatingEarth />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
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
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-4"
          >
            <div className="glass rounded-2xl p-2 flex items-center gap-3">
              <MagnifyingGlass size={24} weight="light" className="text-foreground/50 ml-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for your school..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-foreground/40 text-lg"
              />
              <Button
                type="submit"
                className="neumorphic glow bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-xl transition-all duration-300"
              >
                Search
              </Button>
            </div>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-foreground/50 text-sm"
          >
            Find your school
          </motion.p>
        </motion.div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
    </section>
  );
};

export default Hero;
