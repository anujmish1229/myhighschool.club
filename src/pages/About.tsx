import { PageLayout } from "@/components/PageLayout";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { Target, Lightbulb, Users } from "@phosphor-icons/react";
import { useConfig } from "@/context/ConfigContext";

const About = () => {
  const { config } = useConfig();
  
  const values = [
    {
      icon: Target,
      title: config.missionTitle,
      description: config.missionDescription,
    },
    {
      icon: Lightbulb,
      title: config.innovationTitle,
      description: config.innovationDescription,
    },
    {
      icon: Users,
      title: config.communityTitle,
      description: config.communityDescription,
    },
  ];

  return (
    <PageLayout>
      <section className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-12"
        >
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-light">{config.aboutTitle}</h1>
            <p className="text-xl text-foreground/70">
              {config.aboutDescription}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {values.map((value, index) => (
              <GlassCard key={value.title} delay={index * 0.1}>
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                    <value.icon size={24} weight="light" className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-light">{value.title}</h3>
                  <p className="text-foreground/70">{value.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="mt-16">
            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-light mb-6">{config.storyTitle}</h2>
              <p className="text-foreground/70 leading-relaxed">
                {config.storyParagraph1}
              </p>
              <p className="text-foreground/70 leading-relaxed mt-4">
                {config.storyParagraph2}
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default About;

