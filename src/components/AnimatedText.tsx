import { motion } from 'motion/react';
import { type ReactNode } from 'react';

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  type?:
    | 'fadeIn'
    | 'slideUp'
    | 'typewriter'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'scaleUp'
    | 'bounceIn'
    | 'stagger';
}

export function AnimatedText({
  children,
  className = '',
  delay = 0,
  type = 'fadeIn',
}: AnimatedTextProps) {
  const getAnimation = () => {
    switch (type) {
      case 'fadeIn':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.6, delay },
        };
      case 'slideUp':
        return {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay },
        };
      case 'slideDown':
        return {
          initial: { opacity: 0, y: -30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay },
        };
      case 'slideLeft':
        return {
          initial: { opacity: 0, x: 30 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.6, delay },
        };
      case 'slideRight':
        return {
          initial: { opacity: 0, x: -30 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.6, delay },
        };
      case 'scaleUp':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.5, delay },
        };
      case 'bounceIn':
        return {
          initial: { opacity: 0, scale: 0.3 },
          animate: { opacity: 1, scale: 1 },
          transition: {
            duration: 0.6,
            delay,
            type: 'spring' as const,
            damping: 15,
            stiffness: 300,
          },
        };
      case 'typewriter':
        return {
          initial: { width: 0 },
          animate: { width: 'auto' },
          transition: { duration: 1, delay },
        };
      case 'stagger':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.6, delay },
        };
    }
  };

  const animation = getAnimation();

  if (type === 'typewriter') {
    return (
      <motion.div
        className={`overflow-hidden whitespace-nowrap ${className}`}
        initial={animation.initial}
        animate={animation.animate}
        transition={animation.transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={animation.initial}
      animate={animation.animate}
      transition={animation.transition}
    >
      {children}
    </motion.div>
  );
}
