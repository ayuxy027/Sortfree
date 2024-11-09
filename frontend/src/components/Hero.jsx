// Hero.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import { Zap, Brain, Sparkles, Sliders, ArrowRight } from 'lucide-react';

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

  const [stats, setStats] = useState([
    { id: 1, label: "AI Powered", value: "Gemini 1.5 Pro", icon: Brain, position: 0 },
    { id: 2, label: "Context Window", value: "2 Million", icon: Sparkles, position: 1 },
    { id: 3, label: "Sorting Speed", value: "Super Fast", icon: Zap, position: 2 },
    { id: 4, label: "Your Way :)", value: "Customization?", icon: Sliders, position: 3 },
  ]);

  const [draggingId, setDraggingId] = useState(null);

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

  const getPositionX = (position) => {
    const gap = 24;
    return position * (cardWidth + gap);
  };

  const handleDragStart = (id) => setDraggingId(id);

  const findNearestPosition = (dragX) => {
    const positions = [0, 1, 2, 3];
    let nearestPosition = null;
    let minDistance = Infinity;

    positions.forEach(position => {
      const posX = getPositionX(position);
      const distance = Math.abs(dragX - posX);
      if (distance < minDistance) {
        minDistance = distance;
        nearestPosition = position;
      }
    });

    return minDistance < cardWidth / 2 ? nearestPosition : null;
  };

  const swapPositions = (fromId, toPosition) => {
    setStats(prevStats => {
      const newStats = [...prevStats];
      const fromCard = newStats.find(s => s.id === fromId);
      const toCard = newStats.find(s => s.position === toPosition);
      
      if (fromCard && toCard) {
        const tempPosition = fromCard.position;
        fromCard.position = toCard.position;
        toCard.position = tempPosition;
      }
      
      return newStats;
    });
  };

  const handleDragEnd = (event, info, id) => {
    const currentCard = stats.find(s => s.id === id);
    if (!currentCard) return;

    const dragX = info.offset.x + getPositionX(currentCard.position);
    const nearestPosition = findNearestPosition(dragX);
    
    if (nearestPosition !== null && nearestPosition !== currentCard.position) {
      swapPositions(id, nearestPosition);
    }
    
    setDraggingId(null);
  };

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={heroVariants}
      className={`relative pt-24 pb-32 overflow-hidden
        ${darkMode 
          ? 'bg-gradient-to-br from-background-dark via-background-dark to-primary-950/30' 
          : 'bg-gradient-to-br from-background-light via-background-light to-primary-50'}`}
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-primary-500/5 to-transparent"></div>
        <div className={`absolute inset-0 opacity-35 
          ${darkMode ? 'bg-[url("/noise-dark.png")]' : 'bg-[url("/noise-light.png")]'}`}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                backgroundColor: darkMode ? 'rgba(62,164,167,0.15)' : 'rgba(62,164,167,0.1)',
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
                className="px-8 py-3 rounded-md font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center justify-center shadow-ambient hover:shadow-ambient-lg"
              >
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
                  className={`px-8 py-3 rounded-md font-semibold ${
                    darkMode 
                      ? 'text-text-dark-primary bg-secondary-800 hover:bg-secondary-700' 
                      : 'text-text-light-primary bg-white hover:bg-primary-50'
                  } transition-all duration-300 shadow-ambient hover:shadow-ambient-lg`}
                >
                  Learn More
                </motion.button>
              </>
            )}
          </motion.div>

          <div ref={containerRef} className="relative h-80 max-w-5xl mx-auto mt-16">
            <AnimatePresence>
              {containerWidth > 0 && stats.sort((a, b) => a.position - b.position).map((stat) => {
                const Icon = stat.icon;
                const positionX = getPositionX(stat.position);
                
                return (
                  <motion.div
                    key={stat.id}
                    layout
                    initial={false}
                    animate={{
                      x: positionX,
                      scale: draggingId === stat.id ? 1.05 : 1,
                      zIndex: draggingId === stat.id ? 2 : 1,
                    }}
                    drag="x"
                    dragConstraints={{
                      left: 0,
                      right: containerWidth - cardWidth - 24
                    }}
                    dragElastic={0.1}
                    dragMomentum={false}
                    onDragStart={() => handleDragStart(stat.id)}
                    onDragEnd={(e, info) => handleDragEnd(e, info, stat.id)}
                    style={{
                      position: 'absolute',
                      width: cardWidth,
                      left: 0,
                    }}
                    className={`
                      relative p-6 rounded-2xl
                      ${darkMode 
                        ? 'bg-surface-dark/90 border-secondary-800/50' 
                        : 'bg-surface-light/90 border-primary-200/50'}
                      border-2
                      backdrop-blur-sm
                      transition-all duration-300
                      cursor-grab active:cursor-grabbing
                      hover:shadow-ambient-lg
                    `}
                  >
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-6 h-8 bg-gradient-to-b from-secondary-300 to-secondary-400 rounded-t-full shadow-sm"
                        style={{ 
                          clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 50% 85%, 0 100%)',
                          transform: 'perspective(100px) rotateX(5deg)'
                        }}
                      />
                    </div>
                    
                    <div className="flex flex-col items-center gap-4 mt-2">
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
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;