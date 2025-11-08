import { PageLayout } from "@/components/PageLayout";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { LinkedinLogo, TwitterLogo } from "@phosphor-icons/react";
import { useConfig } from "@/context/ConfigContext";

const Team = () => {
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
            <h1 className="text-5xl md:text-6xl font-light">Our Team</h1>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Meet the passionate individuals driving our club's success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {config.teamMembers.map((member, index) => (
              <GlassCard key={member.name} delay={index * 0.1}>
                <div className="space-y-4">
                  <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4" />
                  <div>
                    <h3 className="text-xl font-medium">{member.name}</h3>
                    <p className="text-sm text-primary">{member.role}</p>
                  </div>
                  <p className="text-sm text-foreground/70">{member.bio}</p>
                  <div className="flex gap-3 pt-2">
                    <a
                      href={member.linkedin}
                      className="text-foreground/60 hover:text-primary transition-colors"
                      aria-label="LinkedIn"
                    >
                      <LinkedinLogo size={20} weight="light" />
                    </a>
                    <a
                      href={member.twitter}
                      className="text-foreground/60 hover:text-primary transition-colors"
                      aria-label="Twitter"
                    >
                      <TwitterLogo size={20} weight="light" />
                    </a>
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

export default Team;

