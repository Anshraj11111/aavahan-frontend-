import { forwardRef, useState } from 'react';

/**
 * TextAreaField Component
 * Premium styled textarea with character counter
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Required field indicator
 * @param {number} props.maxLength - Maximum character length
 * @param {boolean} props.showCounter - Show character counter
 * @param {string} props.helperText - Helper text below textarea
 * @param {number} props.rows - Number of rows
 */
const TextAreaField = forwardRef(({
  label,
  error,
  required = false,
  maxLength,
  showCounter = false,
  helperText,
  rows = 4,
  className = '',
  onChange,
  value,
  ...props
}, ref) => {
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (onChange) onChange(e);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <textarea
          ref={ref}
          rows={rows}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          className={`w-full px-4 py-3 
            bg-navy-900/50 border rounded-lg text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950
            transition-all duration-300 backdrop-blur-sm resize-y
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' 
              : 'border-white/10 focus:border-blue-500 focus:ring-blue-500/50 hover:border-white/20'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        
        {showCounter && maxLength && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {charCount}/{maxLength}
          </div>
        )}
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

TextAreaField.displayName = 'TextAreaField';

export default TextAreaField;
