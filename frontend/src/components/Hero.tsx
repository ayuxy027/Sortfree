import React, { useState, useRef, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import { Zap, Brain, Sparkles, Sliders, ArrowRight, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import ContentSortingLabel from './ContentSortingLabel';

interface HeroProps {
  darkMode: boolean;
}

interface Stat {
  id: number;
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  position: number;
}

const Hero: React.FC<HeroProps> = ({ darkMode }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const containerRef = useRef<HTMLDivElement>(null);

  const heroVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const shimmerVariants: Variants = {
    initial: { x: '-100%', opacity: 0.5 },
    animate: {
      x: '100%',
      opacity: 0.8,
      transition: {
        repeat: Infinity,
        duration: 3,
        ease: 'linear'
      }
    }
  };

  const [stats] = useState<Stat[]>([
    { id: 1, label: "Leverage Gemini 1.5 Pro ", value: "AI Powered", icon: Brain, position: 0 },
    { id: 2, label: "2 Million Tokens ", value: "Context", icon: Sparkles, position: 1 },
    { id: 3, label: "Load content at warp speed", value: "Super Fast", icon: Zap, position: 2 },
    { id: 4, label: "Your Way :)", value: "Customization?", icon: Sliders, position: 3 },
  ]);

  const launchConfetti = (): void => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3ea4a7', '#358589', '#2f6c70'],
    });
  };

  const handleLogin = async (): Promise<void> => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          redirect_uri: window.location.origin,
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
          scope: 'openid profile email read:data write:data'
        }
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  useEffect(() => {
    const updateDimensions = (): void => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        console.log('Container width:', width);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={heroVariants}
      className={`relative pt-24 pb-32 overflow-hidden min-h-screen
        ${darkMode
          ? 'bg-gradient-to-br from-background-dark via-primary-950/20 to-primary-950/40'
          : 'bg-gradient-to-br from-background-light via-primary-100/50 to-primary-200/30'}`}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 to-transparent bg-gradient-radial from-primary-500/10"></div>
        <div className={`absolute inset-0 opacity-35 
          ${darkMode ? 'bg-[url("/noise-dark.png")]' : 'bg-[url("/noise-light.png")]'}`}
        ></div>
      </div>

      <div className="container relative z-10 px-6 mx-auto max-w-7xl sm:px-8 lg:px-12">
        <div className="mb-8">
          <ContentSortingLabel darkMode={darkMode} />
        </div>

        <motion.div
          variants={heroVariants}
          className="mx-auto max-w-5xl text-center"
        >
          <motion.h1
            variants={heroVariants}
            className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal tracking-tight leading-tight ${darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'} text-center`}
          >
            Simplify Your Sorting with{' '}
            <motion.span
              initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
              animate={{
                backgroundColor: darkMode ? 'rgba(62,164,167,0.2)' : 'rgba(62,164,167,0.15)',
              }}
              transition={{ duration: 0.5 }}
              className="inline-block relative px-3 py-1 rounded-lg text-primary-500"
            >
              SortFree.AI
            </motion.span>
          </motion.h1>

          <motion.p
            variants={heroVariants}
            className={`mt-6 text-lg sm:text-xl font-light leading-relaxed ${darkMode ? 'text-text-dark-secondary' : 'text-text-light-secondary'} max-w-3xl mx-auto px-4 sm:px-0`}
          >
            Effortlessly sort your web with AI. Paste, set, and let Sortfree work its magic.
          </motion.p>

          <motion.div
            variants={heroVariants}
            className="flex flex-col gap-4 justify-center items-center mt-10 sm:flex-row sm:gap-6"
          >
            {!isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogin}
                className="flex overflow-hidden relative justify-center items-center px-8 py-4 w-full sm:w-auto min-w-[220px] font-medium text-white bg-gradient-to-r rounded-xl transition-all duration-300 from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-ambient hover:shadow-ambient-lg"
              >
                <motion.div
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent to-transparent via-white/20"
                />
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex justify-center items-center px-8 py-4 w-full sm:w-auto min-w-[220px] font-medium text-white bg-gradient-to-r rounded-xl transition-all duration-300 from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-ambient hover:shadow-ambient-lg"
                >
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={launchConfetti}
                  className="flex justify-center items-center px-8 py-4 w-full sm:w-auto min-w-[220px] font-medium text-white bg-gradient-to-r rounded-xl transition-all duration-300 from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 shadow-ambient hover:shadow-ambient-lg"
                >
                  <Download className="mr-2 w-5 h-5" />
                  Download Extension
                </motion.button>
              </>
            )}
          </motion.div>

          <div ref={containerRef} className="relative mx-auto mt-20 max-w-6xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      p-6 rounded-2xl
                      ${darkMode
                        ? 'bg-surface-dark/90 border-secondary-800/50'
                        : 'bg-surface-light/90 border-primary-200/50'}
                      border-2
                      backdrop-blur-sm
                      transition-all duration-300
                      hover:shadow-ambient-lg
                      w-full
                      h-[200px]
                      flex flex-col justify-center
                    `}
                  >
                    <div className="flex flex-col gap-4 items-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={`
                          w-12 h-12 rounded-xl
                          ${darkMode
                            ? 'bg-primary-800/40'
                            : 'bg-primary-100'}
                          flex items-center justify-center
                        `}
                      >
                        <Icon className={`w-6 h-6 ${darkMode ? 'text-primary-300' : 'text-primary-600'}`} />
                      </motion.div>
                      <div className="text-center">
                        <motion.div
                          className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'} mb-2`}
                        >
                          {stat.value}
                        </motion.div>
                        <motion.div
                          className={`text-xs sm:text-sm ${darkMode ? 'text-text-dark-secondary' : 'text-text-light-secondary'} leading-relaxed`}
                        >
                          {stat.label}
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;