import { Link } from "react-router-dom";
import { EnvelopeSimple, Phone, MapPin, GithubLogo, TwitterLogo, LinkedinLogo } from "phosphor-react";

const Footer = () => {
  return (
    <footer className="glass mt-24">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-semibold text-gradient mb-4">SchoolHub AI</h3>
            <p className="text-foreground/70 mb-6">
              Empowering schools with AI-powered club websites
            </p>
            <div className="flex gap-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <TwitterLogo size={24} weight="light" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <LinkedinLogo size={24} weight="light" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-primary transition-colors"
              >
                <GithubLogo size={24} weight="light" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium mb-4">Quick Links</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-foreground/70 hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/faq" className="text-foreground/70 hover:text-foreground transition-colors">
                FAQ
              </Link>
              <Link to="/contact" className="text-foreground/70 hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-medium mb-4">Get in Touch</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-foreground/70">
                <EnvelopeSimple size={20} weight="light" />
                <span>hello@schoolhub.ai</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <Phone size={20} weight="light" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/70">
                <MapPin size={20} weight="light" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-12 pt-8 text-center text-foreground/60">
          <p>&copy; {new Date().getFullYear()} SchoolHub AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
