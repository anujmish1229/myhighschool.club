import { useParams, Link } from "react-router-dom";
import { getSchoolBySlug } from "@/data/ontarioSchools";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { House, UsersThree, Calendar, Book, Sparkle } from "phosphor-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Club {
  id: string;
  club_slug: string;
  config: {
    clubName: string;
    clubTagline: string;
    primaryColor: string;
    accentColor: string;
  };
}

const SchoolHome = () => {
  const { schoolSlug } = useParams<{ schoolSlug: string }>();
  const school = schoolSlug ? getSchoolBySlug(schoolSlug) : undefined;
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    const fetchClubs = async () => {
      if (!schoolSlug) return;
      
      setLoadingClubs(true);
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('id, club_slug, config')
          .eq('high_school_slug', schoolSlug)
          .eq('status', 'approved');

        if (error) {
          console.error('Error fetching clubs:', error);
        } else {
          setClubs(data || []);
        }
      } catch (error) {
        console.error('Error fetching clubs:', error);
      } finally {
        setLoadingClubs(false);
      }
    };

    fetchClubs();
  }, [schoolSlug]);

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
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 mt-20"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5 mt-20"></div>
        
        <div className="container mx-auto px-6 relative z-10 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto mt-20"
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
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Our <span className="text-gradient">Clubs</span>
          </h2>

          {loadingClubs ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-foreground/70">Loading clubs...</p>
            </div>
          ) : clubs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club, index) => (
                <motion.div
                  key={club.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/${schoolSlug}/${club.club_slug}`}>
                    <div className="glass rounded-2xl p-8 hover:glow transition-all duration-300 text-center cursor-pointer group">
                      <div 
                        className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                        style={{ backgroundColor: `${club.config.primaryColor}20` }}
                      >
                        <Sparkle size={32} weight="duotone" style={{ color: club.config.primaryColor }} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {club.config.clubName}
                      </h3>
                      <p className="text-foreground/60 text-sm">{club.config.clubTagline}</p>
                      <div className="mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Visit Club →
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UsersThree size={64} weight="light" className="mx-auto mb-4 text-foreground/40" />
              <h3 className="text-2xl font-semibold mb-2">No Clubs Yet</h3>
              <p className="text-foreground/60 mb-6">
                Be the first to create a club for {school?.name}!
              </p>
              <Link to="/login">
                <Button>Create a Club</Button>
              </Link>
            </div>
          )}
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
              Want your event featured? Reach out to your club advisor or the myhighschool.club team to get
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
              guides, and student onboarding materials will live here as we roll out myhighschool.club across
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

