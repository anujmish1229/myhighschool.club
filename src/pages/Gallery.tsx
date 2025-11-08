import { PageLayout } from "@/components/PageLayout";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { useConfig } from "@/context/ConfigContext";

const Gallery = () => {
  const { config } = useConfig();
  return (
    <PageLayout>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-light">Gallery</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Capturing moments and memories from our club's journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {config.galleryItems.map((item, index) => (
              <GlassCard key={index} delay={index * 0.05}>
                <div className="space-y-4">
                  <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-accent/20" />
                  <div>
                    <h3 className="text-lg font-medium">{item.title}</h3>
                    <p className="text-sm text-primary">{item.category}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default Gallery;

