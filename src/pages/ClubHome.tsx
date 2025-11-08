import { motion } from "framer-motion";
import { PageLayout } from "@/components/PageLayout";
import { Calendar } from "@/components/Calendar";
import { NeuButton } from "@/components/NeuButton";
import { ArrowRight } from "@phosphor-icons/react";
import { useConfig } from "@/context/ConfigContext";

const ClubHome = () => {
  const { config } = useConfig();
  
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-primary/5" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-light">
              {config.heroTitle.split(config.clubName).length > 1 ? (
                <>
                  {config.heroTitle.split(config.clubName)[0]}
                  <span className="text-primary">{config.clubName}</span>
                  {config.heroTitle.split(config.clubName)[1]}
                </>
              ) : (
                config.heroTitle
              )}
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto font-light">
              {config.heroSubtitle}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex gap-4 justify-center pt-8"
            >
              <NeuButton variant="primary" className="flex items-center gap-2">
                {config.heroButtonPrimary}
                <ArrowRight size={20} weight="light" />
              </NeuButton>
              <NeuButton variant="secondary">{config.heroButtonSecondary}</NeuButton>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      </section>

      {/* Calendar Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Calendar />
      </section>
    </PageLayout>
  );
};

export default ClubHome;

