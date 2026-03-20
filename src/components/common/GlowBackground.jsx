/**
 * GlowBackground Component
 * CSS-only glow effect for sections
 * @param {Object} props
 * @param {string} props.color - Glow color: blue, cyan, purple
 * @param {string} props.position - Position: top, center, bottom
 * @param {string} props.size - Size: sm, md, lg, xl
 * @param {string} props.className - Additional classes
 */
const GlowBackground = ({
  color = 'blue',
  position = 'center',
  size = 'md',
  className = ''
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/10',
    cyan: 'bg-cyan-500/10',
    purple: 'bg-purple-500/10'
  };

  const positionClasses = {
    top: 'top-0',
    center: 'top-1/2 -translate-y-1/2',
    bottom: 'bottom-0'
  };

  const sizeClasses = {
    sm: 'w-[400px] h-[200px]',
    md: 'w-[600px] h-[300px]',
    lg: 'w-[800px] h-[400px]',
    xl: 'w-[1000px] h-[500px]'
  };

  const classes = `absolute left-1/2 -translate-x-1/2 rounded-full blur-3xl pointer-events-none ${colorClasses[color]} ${positionClasses[position]} ${sizeClasses[size]} ${className}`;

  return <div className={classes} />;
};

export default GlowBackground;
