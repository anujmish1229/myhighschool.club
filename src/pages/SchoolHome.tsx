import { useParams, Link } from "react-router-dom";
import { getSchoolBySlug } from "@/data/ontarioSchools";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { House, UsersThree, Calendar, Book } from "phosphor-react";
import { motion } from "framer-motion";

const SchoolHome = () => {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  const school = schoolSlug ? getSchoolBySlug(schoolSlug) : undefined;

  if (!school) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">School Not Found</h1>
            <p className="text-foreground/70 mb-8">
              We couldn't find the school you're looking for.
            </p>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section
        id="home"
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {school.name}
              <span className="text-gradient"> Homepage</span>
            </h1>
            <p className="text-xl md:text-2xl text-foreground/70 mb-8">
              {school.city}, Ontario
            </p>
            <p className="text-lg text-foreground/60 mb-12">
              Welcome to {school.name}'s digital hub. Explore our clubs, activities, and community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Clubs Section */}
      <section id="clubs" className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="glass rounded-2xl p-8 hover:glow transition-all duration-300 text-center">
            <House size={48} weight="light" className="mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Home</h3>
            <p className="text-foreground/60 text-sm">School information</p>
          </div>

          <div className="glass rounded-2xl p-8 hover:glow transition-all duration-300 text-center">
            <UsersThree size={48} weight="light" className="mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Clubs</h3>
            <p className="text-foreground/60 text-sm">Coming soon</p>
          </div>

          <div className="glass rounded-2xl p-8 hover:glow transition-all duration-300 text-center">
            <Calendar size={48} weight="light" className="mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Events</h3>
            <p className="text-foreground/60 text-sm">Coming soon</p>
          </div>

          <div className="glass rounded-2xl p-8 hover:glow transition-all duration-300 text-center">
            <Book size={48} weight="light" className="mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Resources</h3>
            <p className="text-foreground/60 text-sm">Coming soon</p>
          </div>
        </motion.div>
      </section>

      {/* Events Section */}
      <section id="events" className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Upcoming <span className="text-gradient">Events</span>
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed mb-6">
              Event programming for {school.name} is coming soon. Club expos, competitions, and
              community spotlights will appear here with dates, details, and RSVP links.
            </p>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Want your event featured? Reach out to your club advisor or the SchoolHub AI team to get
              on the calendar.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass rounded-3xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Resources <span className="text-gradient">Hub</span>
            </h2>
            <p className="text-lg text-foreground/70 leading-relaxed mb-6">
              Welcome to the official digital hub for {school.name}. Downloadable assets, advisor
              guides, and student onboarding materials will live here as we roll out SchoolHub AI across
              campus.
            </p>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Stay tuned as we build out individual club pages where students can discover activities,
              grab resources, and get involved in our vibrant school community.
            </p>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default SchoolHome;

