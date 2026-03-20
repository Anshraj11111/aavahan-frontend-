import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * SelectField Component
 * Premium styled select dropdown
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.error - Error message
 * @param {Array} props.options - Array of {value, label} objects
 * @param {boolean} props.required - Required field indicator
 * @param {string} props.helperText - Helper text below select
 * @param {string} props.placeholder - Placeholder text
 */
const SelectField = forwardRef(({
  label,
  error,
  options = [],
  required = false,
  helperText,
  placeholder = 'Select an option',
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={`w-full px-4 py-3 pr-10 appearance-none
            bg-navy-900/50 border rounded-lg text-white
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950
            transition-all duration-300 backdrop-blur-sm cursor-pointer
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' 
              : 'border-white/10 focus:border-blue-500 focus:ring-blue-500/50 hover:border-white/20'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        >
          <option value="" className="bg-navy-900 text-gray-400">
            {placeholder}
          </option>
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              className="bg-navy-900 text-white"
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

SelectField.displayName = 'SelectField';

export default SelectField;
