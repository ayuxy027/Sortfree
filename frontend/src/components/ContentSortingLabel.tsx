import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface ContentSortingLabelProps {
  darkMode?: boolean;
}

interface Theme {
  background: string;
  text: string;
  border: string;
  highlight: string;
  shadow: string;
}

const ContentSortingLabel: React.FC<ContentSortingLabelProps> = ({ darkMode = false }) => {
  const theme: Theme = {
    background: darkMode
      ? 'bg-gradient-to-r from-primary-900/30 to-primary-800/30'
      : 'bg-gradient-to-r from-primary-100/50 to-primary-200/50',
    text: darkMode
      ? 'text-text-dark-primary'
      : 'text-text-light-primary',
    border: darkMode
      ? 'border-primary-700/30'
      : 'border-primary-300/50',
    highlight: darkMode
      ? 'bg-gradient-to-r from-primary-700/20 to-primary-600/20'
      : 'bg-gradient-to-r from-primary-300/30 to-primary-200/30',
    shadow: darkMode
      ? 'shadow-primary-900/30'
      : 'shadow-primary-300/40'
  };

  const labelVariants: Variants = {
    initial: {
      opacity: 0,
      y: -20,
      scale: 0.95
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 1
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const pulseVariants: Variants = {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      className="flex justify-center mb-8"
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={labelVariants}
    >
      <div className="relative inline-flex items-center justify-center">
        {/* Ambient glow effect */}
        <motion.div
          className={`
            absolute -inset-2 
            bg-gradient-to-r from-primary-300/20 via-primary-400/20 to-primary-300/20 
            blur-xl opacity-50
          `}
        />

        {/* Pulsing background effect */}
        <motion.div
          className={`absolute inset-0 rounded-full ${theme.highlight}`}
          variants={pulseVariants}
          animate="animate"
        />

        {/* Main label container */}
        <motion.div
          className={`
            relative px-6 py-2 rounded-full
            border ${theme.border}
            ${theme.background}
            backdrop-blur-sm
            flex items-center gap-2
            font-normal tracking-wide
            ${theme.text}
            shadow-lg ${theme.shadow}
            hover:bg-gradient-to-r hover:from-primary-400/15 hover:to-primary-300/15
            transition-all duration-300
          `}
        >
          <Sparkles className="w-5 h-5 text-primary-500" />
          <span>Content Sorting Extension</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContentSortingLabel;