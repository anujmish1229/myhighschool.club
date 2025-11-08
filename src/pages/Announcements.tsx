import { PageLayout } from "@/components/PageLayout";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { MegaphoneSimple, Calendar } from "@phosphor-icons/react";
import { useConfig } from "@/context/ConfigContext";

const Announcements = () => {
  const { config } = useConfig();
  return (
    <PageLayout>
      <section className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-light">Announcements</h1>
            <p className="text-xl text-foreground/70">
              Stay updated with the latest news and events from our club.
            </p>
          </div>

          <div className="space-y-6 mt-16">
            {config.announcements.map((announcement, index) => (
              <GlassCard key={index} delay={index * 0.1}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          announcement.priority === "high"
                            ? "bg-destructive/20"
                            : "bg-primary/20"
                        }`}
                      >
                        <MegaphoneSimple
                          size={20}
                          weight="light"
                          className={
                            announcement.priority === "high"
                              ? "text-destructive"
                              : "text-primary"
                          }
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-medium mb-2">
                          {announcement.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-foreground/60 mb-3">
                          <Calendar size={16} weight="light" />
                          <span>{announcement.date}</span>
                        </div>
                        <p className="text-foreground/70">{announcement.content}</p>
                      </div>
                    </div>
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

export default Announcements;

