import { motion } from "framer-motion";
import { ArrowUpRight, Menu, Zap, Shield, Globe } from "lucide-react";
import { useState } from "react";

export function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Marquee items
  const words = ["NOVAL", "•", "STRIKING", "•", "MODERN", "•", "BOLD", "•", "FEARLESS", "•", "NOVAL", "•", "STRIKING", "•", "MODERN", "•", "BOLD", "•", "FEARLESS", "•"];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0A0A0A] font-['Space_Grotesk'] overflow-hidden selection:bg-[#FF2A00] selection:text-white">
      
      {/* Navigation - Stark, hard bottom border */}
      <nav className="flex items-center justify-between border-b-[3px] border-[#0A0A0A] px-6 py-5 lg:px-12 bg-white relative z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF2A00] flex items-center justify-center">
            <Zap className="text-white w-5 h-5" fill="currentColor" />
          </div>
          <span className="text-2xl font-black font-['Syne'] tracking-tighter uppercase leading-none mt-1">
            Noval.
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10 font-bold text-sm tracking-wide uppercase">
          <a href="#" className="hover:text-[#FF2A00] transition-colors">Manifesto</a>
          <a href="#" className="hover:text-[#FF2A00] transition-colors">Work</a>
          <a href="#" className="hover:text-[#FF2A00] transition-colors">Studio</a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <button className="group relative px-6 py-3 font-bold text-sm uppercase overflow-hidden border-[3px] border-[#0A0A0A] bg-white text-[#0A0A0A] hover:text-white transition-colors duration-300">
            <span className="relative z-10 flex items-center gap-2">
              Start Project <ArrowUpRight className="w-4 h-4" />
            </span>
            <div className="absolute inset-0 bg-[#0A0A0A] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 border-[3px] border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <motion.div 
        initial={false}
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          open: { height: "auto", borderBottom: "3px solid #0A0A0A" },
          closed: { height: 0, borderBottom: "0px solid #0A0A0A" }
        }}
        className="md:hidden bg-white overflow-hidden z-40 relative"
      >
        <div className="flex flex-col p-6 gap-6 text-xl font-bold uppercase font-['Syne']">
          <a href="#" className="hover:text-[#FF2A00]">Manifesto</a>
          <a href="#" className="hover:text-[#FF2A00]">Work</a>
          <a href="#" className="hover:text-[#FF2A00]">Studio</a>
          <button className="mt-4 flex items-center justify-between w-full border-[3px] border-[#0A0A0A] bg-[#FF2A00] text-white p-4">
            Start Project <ArrowUpRight className="w-6 h-6" />
          </button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row relative">
        
        {/* Left Column - Typography & Content */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-6 py-16 lg:p-20 border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-[#0A0A0A] relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex flex-col gap-8 max-w-2xl"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 border-[3px] border-[#0A0A0A] w-fit bg-[#f4f4f0] uppercase text-xs font-bold tracking-widest">
              <div className="w-2 h-2 rounded-full bg-[#FF2A00] animate-pulse" />
              Digital Excellence
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-[7rem] font-black font-['Syne'] leading-[0.9] tracking-tighter uppercase">
              Beyond <br />
              <span style={{ WebkitTextStroke: "2px #0A0A0A", color: "transparent" }}>
                The Grid.
              </span>
            </h1>

            <p className="text-lg sm:text-xl font-medium leading-relaxed max-w-lg text-gray-700">
              We engineer uncompromising digital experiences. No fluff, no filler. Just pure, striking design that demands absolute attention.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
              <button className="group relative px-8 py-5 font-bold text-sm uppercase overflow-hidden border-[3px] border-[#0A0A0A] bg-[#FF2A00] text-white hover:bg-white hover:text-[#0A0A0A] transition-colors duration-300">
                <span className="relative z-10 flex items-center gap-3">
                  Explore Vision <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                </span>
              </button>
              
              <div className="flex -space-x-4 ml-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-[3px] border-[#0A0A0A] bg-[#f4f4f0] flex items-center justify-center relative z-10 hover:z-20 hover:-translate-y-2 transition-transform duration-300">
                    {i === 1 && <Shield className="w-5 h-5" />}
                    {i === 2 && <Globe className="w-5 h-5" />}
                    {i === 3 && <Zap className="w-5 h-5" />}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Visual/Abstract */}
        <div className="w-full lg:w-[45%] bg-[#f4f4f0] relative overflow-hidden flex flex-col min-h-[50vh] lg:min-h-0">
          
          {/* Grid background overlay */}
          <div className="absolute inset-0 opacity-[0.08]" 
               style={{ backgroundImage: 'linear-gradient(#000 2px, transparent 2px), linear-gradient(90deg, #000 2px, transparent 2px)', backgroundSize: '40px 40px' }} />

          {/* Animated Abstract Block */}
          <div className="flex-1 flex items-center justify-center p-8 lg:p-20 relative z-10">
            <motion.div 
              initial={{ scale: 0.8, rotate: -5 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="w-full aspect-square max-w-md relative"
            >
              {/* Solid Blocks layered for a 3D brutalist effect without actual shadows/gradients */}
              <motion.div 
                animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                className="absolute inset-0 border-[4px] border-[#0A0A0A] bg-[#FF2A00] translate-x-6 translate-y-6" 
              />
              <motion.div 
                animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="absolute inset-0 border-[4px] border-[#0A0A0A] bg-[#0A0A0A] translate-x-3 translate-y-3" 
              />
              <div className="absolute inset-0 border-[4px] border-[#0A0A0A] bg-white flex flex-col items-center justify-center p-8 text-center">
                 <Zap className="w-20 h-20 text-[#FF2A00] mb-6" fill="#FF2A00" />
                 <h3 className="font-['Syne'] font-bold text-3xl uppercase leading-none mb-4">
                   Future<br/>Proof
                 </h3>
                 <p className="text-sm font-bold uppercase tracking-widest text-gray-500">v2.0.24</p>
              </div>
            </motion.div>
          </div>

          {/* Bottom stats block for right column */}
          <div className="h-32 border-t-[3px] border-[#0A0A0A] flex bg-white relative z-10">
            <div className="flex-1 border-r-[3px] border-[#0A0A0A] flex flex-col justify-center px-4 sm:px-8">
              <span className="font-['Syne'] font-black text-3xl sm:text-4xl">99%</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Uptime</span>
            </div>
            <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 bg-[#FF2A00] text-white">
              <span className="font-['Syne'] font-black text-3xl sm:text-4xl">10x</span>
              <span className="text-xs font-bold uppercase tracking-wider">Performance</span>
            </div>
          </div>
        </div>
      </main>

      {/* Infinite Marquee Banner */}
      <div className="border-t-[3px] border-[#0A0A0A] bg-[#0A0A0A] text-white overflow-hidden py-4 whitespace-nowrap flex items-center relative z-20">
        <motion.div 
          animate={{ x: [0, "-50%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex items-center gap-8 font-['Syne'] font-bold text-xl uppercase tracking-widest w-max"
        >
          {/* First Set */}
          <div className="flex items-center gap-8">
            {words.map((word, i) => (
              <span key={i} className={word === "•" ? "text-[#FF2A00]" : ""}>{word}</span>
            ))}
          </div>
          {/* Duplicate Set for Seamless Loop */}
          <div className="flex items-center gap-8 pr-8">
            {words.map((word, i) => (
              <span key={`dup-${i}`} className={word === "•" ? "text-[#FF2A00]" : ""}>{word}</span>
            ))}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
