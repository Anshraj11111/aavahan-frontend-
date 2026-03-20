/**
 * GradientBadge Component
 * Small badge with gradient background
 * @param {Object} props
 * @param {string} props.variant - Color variant: blue, cyan, purple, gold, success, warning, danger
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} props.size - Size: sm, md, lg
 * @param {string} props.className - Additional classes
 */
const GradientBadge = ({
  variant = 'blue',
  children,
  size = 'md',
  className = ''
}) => {
  const variantClasses = {
    blue: 'bg-gradient-to-r from-blue-600/20 to-blue-500/20 text-blue-400 border-blue-500/30',
    cyan: 'bg-gradient-to-r from-cyan-600/20 to-cyan-500/20 text-cyan-400 border-cyan-500/30',
    purple: 'bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-purple-400 border-purple-500/30',
    gold: 'bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 text-yellow-400 border-yellow-500/30',
    success: 'bg-gradient-to-r from-green-600/20 to-green-500/20 text-green-400 border-green-500/30',
    warning: 'bg-gradient-to-r from-orange-600/20 to-orange-500/20 text-orange-400 border-orange-500/30',
    danger: 'bg-gradient-to-r from-red-600/20 to-red-500/20 text-red-400 border-red-500/30'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const classes = `inline-flex items-center gap-1.5 rounded-full border font-medium backdrop-blur-sm ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <span className={classes}>
      {children}
    </span>
  );
};

export default GradientBadge;
