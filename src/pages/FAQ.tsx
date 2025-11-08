import { PageLayout } from "@/components/PageLayout";
import { GlassCard } from "@/components/GlassCard";
import { motion } from "framer-motion";
import { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { useConfig } from "@/context/ConfigContext";

const FAQ = () => {
  const { config } = useConfig();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
            <h1 className="text-5xl md:text-6xl font-light">FAQ</h1>
            <p className="text-xl text-foreground/70">
              Find answers to commonly asked questions about our club.
            </p>
          </div>

          <div className="space-y-4 mt-16">
            {config.faqs.map((faq, index) => (
              <GlassCard key={index} delay={index * 0.05}>
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium pr-4">{faq.question}</h3>
                    <CaretDown
                      size={24}
                      weight="light"
                      className={`transition-transform flex-shrink-0 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {openIndex === index && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 text-foreground/70"
                    >
                      {faq.answer}
                    </motion.p>
                  )}
                </button>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </section>
    </PageLayout>
  );
};

export default FAQ;

