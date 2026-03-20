import { useState } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 * Glass background search input with glow on focus and clear button
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text
 * @param {Function} props.onSearch - Search handler
 * @param {string} props.value - Controlled value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.className - Additional classes
 */
const SearchBar = ({
  placeholder = 'Search...',
  onSearch,
  value: controlledValue,
  onChange,
  className = ''
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (!isControlled) {
      setInternalValue(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    if (!isControlled) {
      setInternalValue('');
    }
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`relative glass-panel rounded-lg border transition-all duration-300 ${
        isFocused 
          ? 'border-blue-500/50 shadow-glow' 
          : 'border-white/10'
      }`}>
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none"
        />
        
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
