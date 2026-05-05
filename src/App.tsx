import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

const NoiseOverlay = () => (
  <div 
    className="fixed inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-50"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
  />
);

const Sparkles = () => {
  const [sparks, setSparks] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate gentle, elegant sparkles
    const newSparks = Array.from({length: 40}).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: Math.random() * 5 + 4,
        delay: Math.random() * 3
    }));
    setSparks(newSparks);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {sparks.map(spark => (
        <motion.div
          key={spark.id}
          className="absolute rounded-full bg-blend-screen"
          style={{
            left: `${spark.x}%`,
            top: `${spark.y}%`,
            width: spark.size,
            height: spark.size,
            backgroundColor: '#ffd6e0',
            boxShadow: '0 0 10px 2px #ffd6e0',
            opacity: 0
          }}
          animate={{
            y: [0, -40],
            opacity: [0, 0.4, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: spark.duration,
            delay: spark.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const LuxuryHeart = () => (
  <svg viewBox="0 0 100 100" className="w-[45vw] md:w-[25vw] max-w-[400px] aspect-square drop-shadow-2xl overflow-visible pointer-events-none origin-center">
    <defs>
      <radialGradient id="heartGlow" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffd6e0" />
        <stop offset="35%" stopColor="#7a0c1c" />
        <stop offset="100%" stopColor="#1a0004" />
      </radialGradient>
      <filter id="glass" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#7a0c1c" floodOpacity="0.7"/>
        <feDropShadow dx="0" dy="0" stdDeviation="25" floodColor="#ffd6e0" floodOpacity="0.2"/>
      </filter>
      <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd6e0" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#7a0c1c" stopOpacity="0"/>
      </linearGradient>
    </defs>
    <motion.g
      animate={{ rotateX: [0, 6, -6, 0], rotateY: [0, -12, 12, 0], scale: [1, 1.02, 1] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "50% 50%" }}
    >
      <path d="M50 88 C -20 50, 10 10, 50 30 C 90 10, 120 50, 50 88 Z" fill="url(#heartGlow)" filter="url(#glass)"/>
      <path d="M50 88 C -20 50, 10 10, 50 30 C 90 10, 120 50, 50 88 Z" fill="none" stroke="url(#edgeGlow)" strokeWidth="1.5" style={{ mixBlendMode: 'overlay' }}/>
      <path d="M50 82 C -10 50, 15 17, 50 32 C 85 17, 110 50, 50 82 Z" fill="none" stroke="#ffd6e0" strokeWidth="0.5" strokeOpacity="0.4"/>
    </motion.g>
  </svg>
);

const GlassCard = ({ text, top, left, right, bottom, delay }: any) => (
  <motion.div
    className="absolute px-6 md:px-8 py-3 md:py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl font-sans text-xs md:text-sm tracking-[0.2em] text-[#ffd6e0]/80 uppercase pointer-events-auto cursor-default whitespace-nowrap"
    style={{ top, left, right, bottom }}
    animate={{ y: [0, -15, 0], rotateZ: [0, 2, -2, 0] }}
    transition={{ duration: 6 + Math.random() * 2, delay, repeat: Infinity, ease: "easeInOut" }}
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,214,224,0.1)", zIndex: 50, color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}
  >
    {text}
  </motion.div>
);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 25,
    restDelta: 0.001
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const inverseSpringX = useTransform(springX, (v) => -v * 0.4);
  const inverseSpringY = useTransform(springY, (v) => -v * 0.4);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 40);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Page 1: 0 - 0.25
  const p1Opacity = useTransform(smoothProgress, [0, 0.2, 0.25], [1, 1, 0]);
  const p1Scale   = useTransform(smoothProgress, [0, 0.25], [1, 1.15]);
  const p1Y       = useTransform(smoothProgress, [0, 0.25], ["0%", "-5%"]);

  // Page 2: 0.25 - 0.50
  const p2Opacity = useTransform(smoothProgress, [0.15, 0.25, 0.45, 0.5], [0, 1, 1, 0]);
  const p2Scale   = useTransform(smoothProgress, [0.15, 0.35], [0.9, 1]);
  const p2Y       = useTransform(smoothProgress, [0.15, 0.35], ["5%", "0%"]);

  // Page 3: 0.50 - 0.75
  const p3Opacity = useTransform(smoothProgress, [0.4, 0.5, 0.7, 0.75], [0, 1, 1, 0]);
  const p3Scale   = useTransform(smoothProgress, [0.4, 0.55, 0.75], [0.9, 1, 1.1]);
  const p3Y       = useTransform(smoothProgress, [0.4, 0.55], ["5%", "0%"]);

  // Page 4: 0.75 - 1.00
  const p4Opacity = useTransform(smoothProgress, [0.65, 0.75, 1], [0, 1, 1]);
  const p4Scale   = useTransform(smoothProgress, [0.65, 0.75, 1], [0.95, 1, 1]);
  const p4Y       = useTransform(smoothProgress, [0.65, 0.75, 1], ["5%", "0%", "0%"]);

  // Heart Movement Strategy
  const hScale   = useTransform(smoothProgress, [0, 0.3, 0.6, 0.85, 1], [1, 1.8, 1.3, 4, 4.5]);
  const hXY      = useTransform(smoothProgress, [0, 0.3, 0.6, 0.85, 1], ["10vh", "-10vh", "15vh", "0vh", "0vh"]);
  const hOpacity = useTransform(smoothProgress, [0, 0.3, 0.6, 0.85, 1], [1, 0.3, 0.2, 0.03, 0.03]);

  const handleEnterWorld = () => {
    // Scroll to section 2 roughly
    window.scrollBy({ top: window.innerHeight * 1.5, behavior: "smooth" });
  };

  const heartbeatPulse = useTransform(smoothProgress, [0.4, 0.5, 0.7, 0.75], [0, 1, 1, 0]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#1a0306] select-none" style={{ height: "500vh" }}>
      <NoiseOverlay />
      <Sparkles />
      
      {/* Background Gradient responding to scroll */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(circle at 50% 50%, #7a0c1c 0%, #3a060d 70%, #1a0306 100%)', opacity: p1Opacity }}
      />
      
      {/* Page 3 Pulse Background */}
      <motion.div 
        className="fixed inset-0 pointer-events-none radial-blood"
        style={{ opacity: heartbeatPulse }}
        animate={{ scale: [1, 1.02, 1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
      
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Floating Global Heart */}
        <motion.div
           className="absolute z-10 flex items-center justify-center pointer-events-none"
           style={{ 
             scale: hScale, 
             y: hXY, 
             opacity: hOpacity, 
             x: springX
           }}
        >
           <LuxuryHeart />
        </motion.div>

        {/* --- PAGE 1 --- */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-6"
          style={{ opacity: p1Opacity, scale: p1Scale, y: p1Y, x: inverseSpringX }}
        >
          <div className="text-center z-20 mt-[-10vh]">
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light text-white/90 leading-relaxed tracking-wide drop-shadow-xl">
              Some people enter life… <br />
              <span className="italic text-[#ffd6e0] font-normal leading-[2] text-shadow-sm">and quietly change everything.</span>
            </h1>
          </div>
          <div className="absolute bottom-[15vh] pointer-events-auto">
            <motion.button 
              onClick={handleEnterWorld}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group transition-transform"
            >
              <div className="absolute inset-0 bg-[#ffd6e0] blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative px-12 py-5 rounded-full bg-gradient-to-b from-[#7a0c1c] to-[#4a0711] border border-[#ffd6e0]/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
                <span className="uppercase text-[12px] font-bold tracking-[0.3em] font-sans text-white">Enter Her World</span>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* --- PAGE 2 --- */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-6"
          style={{ opacity: p2Opacity, scale: p2Scale, y: p2Y, x: inverseSpringX }}
        >
          {/* Desktop/Tablet positions */}
          <div className="hidden md:block">
            <GlassCard text="Cute" top="20%" left="15%" delay={0} />
            <GlassCard text="Classy" top="30%" right="18%" delay={1} />
            <GlassCard text="Beautiful" bottom="25%" left="22%" delay={2} />
            <GlassCard text="Pure" bottom="18%" right="25%" delay={3} />
          </div>
          {/* Mobile positions */}
          <div className="block md:hidden">
            <GlassCard text="Cute" top="15%" left="8%" delay={0} />
            <GlassCard text="Classy" top="22%" right="5%" delay={1} />
            <GlassCard text="Beautiful" bottom="20%" left="10%" delay={2} />
            <GlassCard text="Pure" bottom="12%" right="8%" delay={3} />
          </div>

          <div className="max-w-4xl text-center space-y-12 md:space-y-16">
            <motion.p className="font-serif text-2xl md:text-4xl lg:text-5xl text-white/80 italic font-light drop-shadow-md">
              "She is not just beautiful… she is a presence."
            </motion.p>
            
            <div className="space-y-6 md:space-y-8 py-8 md:py-12">
              <p className="font-sans text-xs md:text-sm text-[#ffd6e0]/70 font-bold tracking-[0.3em] uppercase">Kindness that feels real.</p>
              <p className="font-sans text-xs md:text-sm text-[#ffd6e0]/70 font-bold tracking-[0.3em] uppercase">Straightforward… yet deeply rare.</p>
              <p className="font-sans text-xs md:text-sm text-[#ffd6e0]/70 font-bold tracking-[0.3em] uppercase">The kind of soul you don’t find twice.</p>
            </div>

            <div className="mt-8">
              <h2 className="font-serif text-[clamp(4rem,8vw,90px)] font-bold text-[#ffd6e0] leading-none drop-shadow-2xl italic">
                A part of the moon.
              </h2>
            </div>
          </div>
        </motion.div>

        {/* --- PAGE 3 --- */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20 px-6"
          style={{ opacity: p3Opacity, scale: p3Scale, y: p3Y, x: inverseSpringY }}
        >
          <div className="max-w-4xl text-center space-y-16 md:space-y-24">
            <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-white/80 leading-relaxed font-light">
              I’ve seen many people… <br/>
              <span className="italic">but I feel like I’ve seen the best girl in my life… in you.</span>
            </p>

            <p className="font-serif text-xl md:text-3xl lg:text-4xl text-[#ffd6e0]/90 leading-relaxed font-light">
              When you came into my life… <br/>
              <span className="italic">everything started becoming positive.</span>
            </p>

            <div className="pt-12 md:pt-20">
              <p className="font-sans text-xs md:text-sm uppercase tracking-[0.4em] text-[#ffd6e0]/60 mb-6 font-bold">Your eyes…</p>
              <h2 className="font-sans font-bold uppercase text-[32px] md:text-6xl lg:text-7xl text-white tracking-[0.1em]" style={{ textShadow: '0 0 15px rgba(255,214,224,0.8)' }}>
                dangerously addictive
              </h2>
            </div>
          </div>
        </motion.div>

        {/* --- PAGE 4 --- */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-30 px-6"
          style={{ opacity: p4Opacity, scale: p4Scale, y: p4Y }}
        >
          <div className="max-w-5xl w-full text-center flex flex-col items-center justify-between h-[85vh] py-[10vh]">
            
            <div className="space-y-4">
              <h1 className="font-sans text-[clamp(4rem,12vw,130px)] font-bold leading-none tracking-tighter text-[#ffd6e0] drop-shadow-2xl mb-4" style={{ textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
                HETVI
              </h1>
              <p className="font-serif text-3xl md:text-5xl italic text-white/90">
                Happy Birthday
              </p>
              <p className="font-sans mt-4 text-xs md:text-base text-[#ffd6e0]/80 tracking-[0.3em] font-bold uppercase">
                Not just a name… but a feeling.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center italic font-serif text-xl md:text-2xl lg:text-3xl text-[#ffd6e0]/90 py-8 pointer-events-auto">
              <span className="glow-hover">You are rare.</span>
              <span className="glow-hover">You are special.</span>
              <span className="glow-hover">You are unforgettable.</span>
            </div>

            <div className="space-y-12">
              <p className="font-serif text-2xl md:text-4xl lg:text-5xl text-[#ffd6e0] leading-relaxed font-light">
                Stay exactly the way you are… <br/>
                <span className="italic text-white/90 drop-shadow-lg text-xl md:text-3xl lg:text-4xl">because the world needs more of you.</span>
              </p>

              <p className="font-sans text-[10px] md:text-xs tracking-[0.5em] uppercase text-[#7a0c1c] glow-hover pointer-events-auto cursor-default mt-8 opacity-60">
                ( Badmosh )
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </div>
  );
}

