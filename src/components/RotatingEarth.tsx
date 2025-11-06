import { useEffect, useRef } from "react";

const RotatingEarth = () => {
  const earthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const earth = earthRef.current;
    if (!earth) return;

    let rotation = 0;
    const animate = () => {
      rotation += 0.2;
      earth.style.transform = `rotateY(${rotation}deg)`;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1000">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Earth sphere */}
        <div
          ref={earthRef}
          className="w-96 h-96 rounded-full relative preserve-3d"
          style={{
            background: `
              radial-gradient(circle at 30% 30%, hsl(210 100% 65%) 0%, hsl(195 100% 50%) 30%, hsl(220 80% 40%) 70%, hsl(220 60% 20%) 100%)
            `,
            boxShadow: `
              inset -40px -40px 80px rgba(0, 0, 0, 0.5),
              0 0 100px hsla(210, 100%, 65%, 0.3),
              0 0 200px hsla(195, 100%, 60%, 0.2)
            `,
          }}
        >
          {/* Continents overlay */}
          <div
            className="absolute inset-0 rounded-full opacity-20"
            style={{
              background: `
                radial-gradient(ellipse at 20% 50%, transparent 30%, hsl(120 40% 30%) 31%, transparent 35%),
                radial-gradient(ellipse at 70% 40%, transparent 25%, hsl(120 40% 30%) 26%, transparent 30%),
                radial-gradient(ellipse at 50% 70%, transparent 35%, hsl(120 40% 30%) 36%, transparent 40%)
              `,
            }}
          />
        </div>

        {/* Glow effect */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            background: "radial-gradient(circle, hsl(210 100% 65%) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
};

export default RotatingEarth;
