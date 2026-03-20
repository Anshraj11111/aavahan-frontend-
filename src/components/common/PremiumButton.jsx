import { motion } from 'framer-motion';
import { buttonTap } from '../../lib/animations';

/**
 * PremiumButton Component
 * Reusable button with multiple variants and sizes
 * @param {Object} props
 * @param {string} props.variant - Button style: primary, secondary, ghost, danger, glass
 * @param {string} props.size - Button size: sm, md, lg, xl
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ReactNode} props.icon - Optional icon element
 * @param {boolean} props.iconRight - Position icon on right
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {string} props.className - Additional classes
 */
const PremiumButton = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconRight = false,
  disabled = false,
  loading = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 shadow-button hover:shadow-button-hover focus:ring-blue-500',
    secondary: 'bg-navy-800 text-white border border-blue-500/30 hover:border-blue-500/60 hover:bg-navy-700 shadow-glow-sm hover:shadow-glow focus:ring-blue-500',
    ghost: 'text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-500 shadow-lg hover:shadow-red-500/50 focus:ring-red-500',
    glass: 'glass-panel text-white border border-white/10 hover:border-white/20 hover:bg-white/10 focus:ring-blue-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {!loading && icon && !iconRight && icon}
      {children}
      {!loading && icon && iconRight && icon}
    </>
  );

  return (
    <motion.button
      className={classes}
      disabled={disabled || loading}
      variants={buttonTap}
      whileTap="tap"
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default PremiumButton;
