import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "What is SchoolHub AI?",
      answer: "SchoolHub AI is an AI-powered platform that helps high schools create beautiful, professional websites for their clubs and activities. We handle all the technical details so you can focus on building community.",
    },
    {
      question: "How does the AI technology work?",
      answer: "Our AI analyzes your club's information, generates custom designs, and creates engaging content tailored to your school's unique identity. It continuously learns and improves to deliver the best possible experience.",
    },
    {
      question: "How long does it take to set up?",
      answer: "Most schools can have their first club website live in under 24 hours. Our streamlined process and AI automation mean you spend less time on setup and more time engaging with your community.",
    },
    {
      question: "Can we customize our club websites?",
      answer: "Absolutely! While our AI provides intelligent defaults, you have complete control over design, content, and functionality. Our platform is designed to be both powerful and flexible.",
    },
    {
      question: "What kind of support do you offer?",
      answer: "We provide comprehensive support including documentation, video tutorials, live chat, and dedicated account managers for enterprise clients. Our team is committed to your success.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! We offer a 30-day free trial with full access to all features. No credit card required. Experience the difference SchoolHub AI can make for your school.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h1>

          <p className="text-xl text-foreground/70 text-center mb-16">
            Everything you need to know about SchoolHub AI
          </p>

          <div className="glass rounded-3xl p-8 md:p-12">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-b border-border/50 last:border-0"
                >
                  <AccordionTrigger className="text-left text-lg font-medium hover:text-primary transition-colors">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/70 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
