/**
 * Framer Motion Animation Variants Library
 * Centralized animation definitions for consistent motion design
 * Includes mobile-optimized variants with reduced motion
 */

// Detect if user prefers reduced motion or is on mobile
// Cache the result to prevent repeated checks
let cachedReduceMotion = null;

const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    navigator.userAgent.toLowerCase()
  ) || window.innerWidth < 768;
};

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const shouldReduceMotion = () => {
  if (cachedReduceMotion === null) {
    cachedReduceMotion = isMobile() || prefersReducedMotion();
  }
  return cachedReduceMotion;
};

/**
 * Fade up animation - for sections and content blocks
 * @type {import('framer-motion').Variants}
 */
export const fadeUp = {
  hidden: { opacity: 0, y: shouldReduceMotion() ? 10 : 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: shouldReduceMotion() ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

/**
 * Fade in up animation - alias for fadeUp
 * @type {import('framer-motion').Variants}
 */
export const fadeInUp = {
  hidden: { opacity: 0, y: shouldReduceMotion() ? 10 : 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: shouldReduceMotion() ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

/**
 * Simple fade in animation
 * @type {import('framer-motion').Variants}
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { duration: 0.5, ease: 'easeOut' } 
  }
};

/**
 * Slide in from left animation
 * @type {import('framer-motion').Variants}
 */
export const slideInLeft = {
  hidden: { opacity: 0, x: shouldReduceMotion() ? -20 : -60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: shouldReduceMotion() ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

/**
 * Slide left animation - alias for slideInLeft
 * @type {import('framer-motion').Variants}
 */
export const slideLeft = {
  hidden: { opacity: 0, x: shouldReduceMotion() ? -20 : -60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: shouldReduceMotion() ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

/**
 * Slide in from right animation
 * @type {import('framer-motion').Variants}
 */
export const slideInRight = {
  hidden: { opacity: 0, x: shouldReduceMotion() ? 20 : 60 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: shouldReduceMotion() ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1] } 
  }
};

/**
 * Container for staggered children animations
 * @type {import('framer-motion').Variants}
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      staggerChildren: shouldReduceMotion() ? 0.05 : 0.1, 
      delayChildren: shouldReduceMotion() ? 0.05 : 0.1 
    }
  }
};

/**
 * Scale up animation - for cards and modals
 * @type {import('framer-motion').Variants}
 */
export const scaleUp = {
  hidden: { opacity: 0, scale: shouldReduceMotion() ? 0.95 : 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: shouldReduceMotion() ? 0.2 : 0.4, ease: [0.16, 1, 0.3, 1] } 
  }
};

/**
 * Card hover animation
 * @type {import('framer-motion').Variants}
 */
export const cardHover = {
  rest: { 
    y: 0, 
    boxShadow: '0 4px 24px rgba(0,0,0,0.4)' 
  },
  hover: { 
    y: shouldReduceMotion() ? -2 : -6, 
    boxShadow: '0 20px 60px rgba(59,130,246,0.3)', 
    transition: { duration: 0.3, ease: 'easeOut' } 
  }
};

/**
 * Button micro interaction
 * @type {Object}
 */
export const buttonTap = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 }
};

/**
 * Hero text word-by-word reveal animation
 * @type {import('framer-motion').Variants}
 */
export const heroWord = {
  hidden: { 
    opacity: 0, 
    y: shouldReduceMotion() ? 10 : 50, 
    filter: shouldReduceMotion() ? 'blur(0px)' : 'blur(8px)' 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { 
      duration: shouldReduceMotion() ? 0.3 : 0.7, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

/**
 * Slide down animation - for dropdowns and menus
 * @type {import('framer-motion').Variants}
 */
export const slideDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3, ease: 'easeOut' } 
  }
};

/**
 * Slide up animation - for bottom sheets and toasts
 * @type {import('framer-motion').Variants}
 */
export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3, ease: 'easeOut' } 
  }
};

/**
 * Rotate in animation - for icons and small elements
 * @type {import('framer-motion').Variants}
 */
export const rotateIn = {
  hidden: { opacity: 0, rotate: -180 },
  visible: { 
    opacity: 1, 
    rotate: 0, 
    transition: { duration: 0.5, ease: 'easeOut' } 
  }
};

/**
 * Expand animation - for accordions and collapsible content
 * @type {import('framer-motion').Variants}
 */
export const expand = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { 
    height: 'auto', 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

/**
 * Modal backdrop animation
 * @type {import('framer-motion').Variants}
 */
export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  }
};

/**
 * Modal content animation
 * @type {import('framer-motion').Variants}
 */
export const modalContent = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
  }
};

/**
 * Page transition animation
 * @type {import('framer-motion').Variants}
 */
export const pageTransition = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

/**
 * Stagger children with custom delay
 * @param {number} staggerDelay - Delay between each child animation
 * @returns {import('framer-motion').Variants}
 */
export const staggerChildren = (staggerDelay = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1
    }
  }
});

/**
 * Fade and scale animation
 * @type {import('framer-motion').Variants}
 */
export const fadeScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};
