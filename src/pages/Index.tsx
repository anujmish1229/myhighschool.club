import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkle, Users, Rocket, Heart, EnvelopeSimple, User, ChatCircleText, PaperPlaneTilt } from "phosphor-react";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

const Index = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const values = [
    {
      icon: <Sparkle size={32} weight="light" />,
      title: "Innovation",
      description: "Pushing the boundaries of what's possible with AI technology",
    },
    {
      icon: <Users size={32} weight="light" />,
      title: "Community",
      description: "Building connections between students, clubs, and schools",
    },
    {
      icon: <Rocket size={32} weight="light" />,
      title: "Excellence",
      description: "Delivering premium experiences that exceed expectations",
    },
    {
      icon: <Heart size={32} weight="light" />,
      title: "Impact",
      description: "Making a difference in how schools engage their communities",
    },
  ];

  const faqs = [
    {
      question: "What is myhighschool.club?",
      answer: "myhighschool.club is an AI-powered platform that helps high schools create beautiful, professional websites for their clubs and activities. We handle all the technical details so you can focus on building community.",
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
      answer: "Yes! We offer a 30-day free trial with full access to all features. No credit card required. Experience the difference myhighschool.club can make for your school.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section id="home">
        <Hero />
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-center">
            About <span className="text-gradient">myhighschool.club</span>
          </h2>

          <div className="glass rounded-3xl p-8 md:p-12 mb-16">
            <p className="text-xl text-foreground/80 leading-relaxed mb-6">
              We're on a mission to revolutionize how schools showcase their clubs and activities.
              Using cutting-edge AI technology, we create stunning, personalized websites that help
              school communities thrive.
            </p>
            <p className="text-xl text-foreground/80 leading-relaxed">
              Founded by educators and technologists, myhighschool.club understands the unique challenges
              schools face in engaging students. Our platform makes it effortless to build beautiful,
              functional websites that students, parents, and staff love to use.
            </p>
          </div>

          <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Values</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-8 hover:glow transition-all duration-300"
              >
                <div className="text-primary mb-4">{value.icon}</div>
                <h4 className="text-2xl font-semibold mb-3">{value.title}</h4>
                <p className="text-foreground/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-center">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>

          <p className="text-xl text-foreground/70 text-center mb-16">
            Everything you need to know about myhighschool.club
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
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-center">
            Get in <span className="text-gradient">Touch</span>
          </h2>

          <p className="text-xl text-foreground/70 text-center mb-16">
            Have questions? We'd love to hear from you.
          </p>

          <div className="glass rounded-3xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <div className="relative">
                  <User
                    size={20}
                    weight="light"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50"
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="Your name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <div className="relative">
                  <EnvelopeSimple
                    size={20}
                    weight="light"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50"
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <div className="relative">
                  <ChatCircleText
                    size={20}
                    weight="light"
                    className="absolute left-4 top-4 text-foreground/50"
                  />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full bg-secondary/50 border border-border/50 rounded-xl pl-12 pr-4 py-3 text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Tell us how we can help..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full neumorphic glow bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Send Message</span>
                <PaperPlaneTilt size={20} weight="light" />
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="glass rounded-2xl p-6">
              <EnvelopeSimple size={32} weight="light" className="mx-auto mb-3 text-primary" />
              <p className="text-sm text-foreground/70">hello@myhighschool.club</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <ChatCircleText size={32} weight="light" className="mx-auto mb-3 text-primary" />
              <p className="text-sm text-foreground/70">Live Chat Available</p>
            </div>
            <div className="glass rounded-2xl p-6">
              <User size={32} weight="light" className="mx-auto mb-3 text-primary" />
              <p className="text-sm text-foreground/70">24/7 Support</p>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
