"use client";
import { motion } from "framer-motion";
import DotWaveBackground from "./DotWaveBackground"; // Import the background component
import CustomButton from "./heroButton";
import Dashboard from "./dashboard"; // Import the dashboard component

const HeroSection = () => {
  return (
    // Main section container - Needs relative positioning for absolute children
    <>
      <section className="relative flex items-center justify-center min-h-screen w-full bg-neutral-950 text-white">
        {/* --- Canvas Dot Grid Background --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute inset-0 overflow-hidden"
        >
          <DotWaveBackground
            dotColor="rgba(115, 115, 115, 0.5)"
            dotSpacing={20}
            dotSize={1}
            waveAmplitude={4}
            waveFrequency={0.02}
            waveSpeed={6}
            noiseAmplitude={2.0}
            noiseFrequency={0.035}
            noiseSpeed={0.005}
            perspectiveFactor={0.2}
            peakColorShift={{ r: 89, g: 227, b: 255 }}
            initialRandomness={1.0}
            glowIntensityThreshold={0.75}
            glowProbability={0.01}
            glowRadiusMultiplier={5}
            glowColor="rgba(255, 255, 255, 0.08)"
          />
          {/* Optional gradient overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,#0a0a0a_90%)] z-5"></div>
        </motion.div>

        <div className="relative z-10 flex w-full max-w-7xl mx-auto items-center justify-center px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Flex container for Text (Left) and Dashboard (Right) */}
          <div className="flex flex-col items-center justify-center gap-12 lg:gap-16 w-full">
            {/* --- Left Column: Text Content --- */}
            <div className="flex flex-col items-center w-full text-center space-y-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-center pt-15"
              >
                <span className="bg-gradient-to-b from-neutral-50 via-neutral-100 to-neutral-300 bg-clip-text text-transparent drop-shadow-[0px_0px_32px_rgba(133,133,133,0.4)]">
                  Transform Your Business Data Into Strategic Insights.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="text-xl sm:text-2xl text-neutral-300 pt-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                The all-in-one analytics platform that helps decision-makers
                turn complex data into actionable business intelligence.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="mx-auto lg:mx-0 pt-5"
              >
                <CustomButton />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="w-7xl h-auto no-scrollbar rounded-lg mt-10 border border-white/20 bg-neutral-900 drop-shadow-[0px_0px_60px_rgba(63,217,183,0.1)]"
                style={{
                  maxHeight: "97vh",
                  overflowY: "hidden",
                  msOverflowStyle: "none" /* IE and Edge */,
                  scrollbarWidth: "none" /* Firefox */,
                }}
              >
                <Dashboard />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
