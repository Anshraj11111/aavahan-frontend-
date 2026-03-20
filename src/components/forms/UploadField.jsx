import { forwardRef, useState } from 'react';
import { Upload, X, FileImage, AlertCircle } from 'lucide-react';

/**
 * UploadField Component
 * Drag-and-drop file upload with preview and validation
 * @param {Object} props
 * @param {string} props.label - Field label
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Required field indicator
 * @param {string} props.accept - Accepted file types
 * @param {number} props.maxSize - Max file size in MB
 * @param {Function} props.onChange - Change handler
 * @param {string} props.helperText - Helper text
 */
const UploadField = forwardRef(({
  label,
  error,
  required = false,
  accept = 'image/*',
  maxSize = 5,
  onChange,
  helperText,
  className = '',
  ...props
}, ref) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const validateFile = (file) => {
    if (!file) return false;
    
    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSize) {
      setUploadError(`File size must be less than ${maxSize}MB`);
      return false;
    }
    
    // Check file type
    const acceptedTypes = accept.split(',').map(t => t.trim());
    const fileType = file.type;
    const isAccepted = acceptedTypes.some(type => {
      if (type === 'image/*') return fileType.startsWith('image/');
      return fileType === type;
    });
    
    if (!isAccepted) {
      setUploadError('Invalid file type');
      return false;
    }
    
    setUploadError('');
    return true;
  };

  const handleFile = (selectedFile) => {
    if (!validateFile(selectedFile)) return;
    
    setFile(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
    
    if (onChange) onChange(selectedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setUploadError('');
    if (onChange) onChange(null);
  };

  const displayError = error || uploadError;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer
            ${dragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : displayError
              ? 'border-red-500/50 bg-red-500/5'
              : 'border-white/20 bg-navy-900/30 hover:border-blue-500/50 hover:bg-navy-900/50'
            }
            ${className}`}
        >
          <input
            ref={ref}
            type="file"
            accept={accept}
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            {...props}
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Upload className="w-6 h-6 text-blue-400" />
            </div>
            
            <div>
              <p className="text-white font-medium mb-1">
                Drop your file here, or <span className="text-blue-400">browse</span>
              </p>
              <p className="text-sm text-gray-500">
                {accept.includes('image') ? 'PNG, JPG, JPEG' : accept} up to {maxSize}MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border border-white/10 rounded-lg p-4 bg-navy-900/30">
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-4">
            {preview ? (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-20 h-20 object-cover rounded-lg"
              />
            ) : (
              <div className="w-20 h-20 rounded-lg bg-navy-800 flex items-center justify-center">
                <FileImage className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
      
      {displayError && (
        <p className="mt-1.5 text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {displayError}
        </p>
      )}
      
      {helperText && !displayError && (
        <p className="mt-1.5 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

UploadField.displayName = 'UploadField';

export default UploadField;
