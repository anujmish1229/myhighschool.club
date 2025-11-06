import { motion } from "framer-motion";
import { Sparkle, Users, Rocket, Heart } from "phosphor-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
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

  return (
    <div className="min-h-screen">
      <Navigation />

      <main className="container mx-auto px-6 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center">
            About <span className="text-gradient">SchoolHub AI</span>
          </h1>

          <div className="glass rounded-3xl p-8 md:p-12 mb-16">
            <p className="text-xl text-foreground/80 leading-relaxed mb-6">
              We're on a mission to revolutionize how schools showcase their clubs and activities. 
              Using cutting-edge AI technology, we create stunning, personalized websites that help 
              school communities thrive.
            </p>
            <p className="text-xl text-foreground/80 leading-relaxed">
              Founded by educators and technologists, SchoolHub AI understands the unique challenges 
              schools face in engaging students. Our platform makes it effortless to build beautiful, 
              functional websites that students, parents, and staff love to use.
            </p>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Values</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="glass rounded-2xl p-8 hover:glow transition-all duration-300"
              >
                <div className="text-primary mb-4">{value.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                <p className="text-foreground/70">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
