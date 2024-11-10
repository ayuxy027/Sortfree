import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import { Zap, Brain, Sparkles, Sliders, ArrowRight, Download } from 'lucide-react';
import confetti from 'canvas-confetti';
import ContentSortingLabel from './ContentSortingLabel';

const Hero = ({ darkMode }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const heroVariants = {
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

  const shimmerVariants = {
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

  const [stats] = useState([
    { id: 1, label: "Leverage Gemini 1.5 Pro ", value: "AI Powered", icon: Brain, position: 0 },
    { id: 2, label: "2 Million Tokens ", value: "Context", icon: Sparkles, position: 1 },
    { id: 3, label: "Load content at warp speed", value: "Super Fast", icon: Zap, position: 2 },
    { id: 4, label: "Your Way :)", value: "Customization?", icon: Sliders, position: 3 },
  ]);

  const launchConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3ea4a7', '#358589', '#2f6c70'],
    });
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        setCardWidth(width / 4 - 24);
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
      className={`relative pt-20 pb-32 overflow-hidden
        ${darkMode 
          ? 'bg-gradient-to-br from-background-dark via-primary-950/20 to-primary-950/40' 
          : 'bg-gradient-to-br from-background-light via-primary-100/50 to-primary-200/30'}`}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/10 to-transparent"></div>
        <div className={`absolute inset-0 opacity-35 
          ${darkMode ? 'bg-[url("/noise-dark.png")]' : 'bg-[url("/noise-light.png")]'}`}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-8">
          <ContentSortingLabel darkMode={darkMode} />
        </div>

        <motion.div 
          variants={heroVariants}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.h1 
            variants={heroVariants}
            className={`text-4xl sm:text-5xl md:text-6xl font-extrabold ${darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'}`}
          >
            Simplify Your Sorting with{' '}
            <motion.span
              initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
              animate={{ 
                backgroundColor: darkMode ? 'rgba(62,164,167,0.2)' : 'rgba(62,164,167,0.15)',
              }}
              transition={{ duration: 0.5 }}
              className="px-2 rounded-md relative inline-block text-primary-500"
            >
              SortFree.AI
            </motion.span>
          </motion.h1>

          <motion.p 
            variants={heroVariants}
            className={`mt-6 text-xl ${darkMode ? 'text-text-dark-secondary' : 'text-text-light-secondary'} max-w-3xl mx-auto`}
          >
            Effortlessly sort and organize web content using AI-powered custom sorting. Just paste the class or ID, add your parameters, and let SortFree.AI do the rest.
          </motion.p>

          <motion.div 
            variants={heroVariants}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            {!isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => loginWithRedirect()}
                className="relative px-8 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center justify-center shadow-ambient hover:shadow-ambient-lg overflow-hidden"
              >
                <motion.div
                  variants={shimmerVariants}
                  initial="initial"
                  animate="animate"
                  className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                />
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center justify-center shadow-ambient hover:shadow-ambient-lg"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={launchConfetti}
                  className="px-8 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 transition-all duration-300 flex items-center justify-center shadow-ambient hover:shadow-ambient-lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Extension
                </motion.button>
              </>
            )}
          </motion.div>

          <div ref={containerRef} className="relative h-96 max-w-5xl mx-auto mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    `}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className={`
                          w-12 h-12 rounded-full
                          flex items-center justify-center
                          ${darkMode ? 'bg-primary-700/50' : 'bg-primary-100'}
                          backdrop-blur-sm
                        `}
                      >
                        <Icon className={`w-6 h-6 ${darkMode ? 'text-primary-300' : 'text-primary-600'}`} />
                      </motion.div>
                      
                      <div>
                        <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-text-dark-primary' : 'text-text-light-primary'}`}>
                          {stat.value}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-text-dark-secondary' : 'text-text-light-secondary'}`}>
                          {stat.label}
                        </p>
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