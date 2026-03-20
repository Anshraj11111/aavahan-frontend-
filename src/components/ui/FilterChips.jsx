import { motion } from 'framer-motion';
import { buttonTap } from '../../lib/animations';

/**
 * FilterChips Component
 * Horizontal scrollable filter chips with selected state
 * @param {Object} props
 * @param {Array} props.filters - Array of {value, label} objects
 * @param {string} props.selected - Currently selected filter value
 * @param {Function} props.onSelect - Selection handler
 * @param {string} props.className - Additional classes
 */
const FilterChips = ({
  filters = [],
  selected,
  onSelect,
  className = ''
}) => {
  return (
    <div className={`flex gap-2 overflow-x-auto pb-2 scrollbar-hide ${className}`}>
      {filters.map((filter) => {
        const isSelected = selected === filter.value;
        
        return (
          <motion.button
            key={filter.value}
            onClick={() => onSelect(filter.value)}
            variants={buttonTap}
            whileTap="tap"
            className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 flex-shrink-0
              ${isSelected
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-glow'
                : 'glass-panel text-gray-400 border border-white/10 hover:border-blue-500/50 hover:text-white'
              }`}
          >
            {filter.label}
          </motion.button>
        );
      })}
    </div>
  );
};

export default FilterChips;
