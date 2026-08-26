import React from 'react';
import { motion } from 'framer-motion';

const AnimatedText = ({ text, as: Tag = 'h1', delay = 0, className, style }) => {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { y: '100%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline' }}
    >
      <Tag className={className} style={style}>
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden mr-[0.3em] last:mr-0"
          >
            <motion.span variants={wordVariants} className="inline-block">
              {word}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
};

export default AnimatedText;
