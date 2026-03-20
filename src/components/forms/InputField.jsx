import { forwardRef } from 'react';

/**
 * InputField Component
 * Premium styled input field with error states and icons
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.error - Error message
 * @param {React.ReactNode} props.icon - Left icon
 * @param {React.ReactNode} props.rightIcon - Right icon
 * @param {boolean} props.required - Required field indicator
 * @param {string} props.helperText - Helper text below input
 */
const InputField = forwardRef(({
  label,
  error,
  icon,
  rightIcon,
  required = false,
  helperText,
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
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          className={`w-full px-4 py-3 ${icon ? 'pl-10' : ''} ${rightIcon ? 'pr-10' : ''} 
            bg-navy-900/50 border rounded-lg text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-navy-950
            transition-all duration-300 backdrop-blur-sm
            ${error 
              ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' 
              : 'border-white/10 focus:border-blue-500 focus:ring-blue-500/50 hover:border-white/20'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
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

InputField.displayName = 'InputField';

export default InputField;
