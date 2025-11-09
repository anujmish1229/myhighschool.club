import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, ArrowLeft } from "phosphor-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070c16] px-4 py-16 sm:px-6">
      <div className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(120% 120% at 20% 90%, rgba(11,19,32,0.85) 0%, rgba(11,19,32,0.65) 45%, rgba(11,19,32,0) 100%)" }} />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-16 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute bottom-12 left-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex w-full max-w-lg flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-[0_40px_140px_-70px_rgba(59,130,246,0.8)] backdrop-blur-xl"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
          <Compass size={28} weight="duotone" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gradient">Club not found</h1>
          <p className="text-sm text-foreground/60">
            We couldn't find the page you're looking for. Double-check the URL or head back to the main menu.
          </p>
        </div>
        <Button
          onClick={() => navigate('/')}
          className="glass flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-6 py-3 text-sm font-semibold text-foreground/80 shadow-lg backdrop-blur hover:bg-white/20 hover:text-foreground"
        >
          <ArrowLeft size={18} weight="bold" />
          Return to homepage
        </Button>
      </motion.div>
    </div>
  );
};

export default NotFound;
