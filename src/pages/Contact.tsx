import { useState } from "react";
import { motion } from "framer-motion";
import { EnvelopeSimple, User, ChatCircleText, PaperPlaneTilt } from "phosphor-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

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

      <main className="container mx-auto px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center">
            Get in <span className="text-gradient">Touch</span>
          </h1>

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
              <p className="text-sm text-foreground/70">hello@schoolhub.ai</p>
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
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
