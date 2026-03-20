import { toast as hotToast } from 'react-hot-toast';

/**
 * useToast Hook
 * Hook-based notification system using react-hot-toast
 * @returns {Object} Toast methods
 */
const useToast = () => {
  const defaultOptions = {
    duration: 4000,
    position: 'top-right',
    style: {
      background: 'rgba(10, 22, 40, 0.95)',
      color: '#fff',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(12px)',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500'
    }
  };

  const toast = {
    success: (message, options = {}) => {
      return hotToast.success(message, {
        ...defaultOptions,
        ...options,
        iconTheme: {
          primary: '#10b981',
          secondary: '#fff'
        }
      });
    },

    error: (message, options = {}) => {
      return hotToast.error(message, {
        ...defaultOptions,
        ...options,
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff'
        }
      });
    },

    loading: (message, options = {}) => {
      return hotToast.loading(message, {
        ...defaultOptions,
        ...options
      });
    },

    info: (message, options = {}) => {
      return hotToast(message, {
        ...defaultOptions,
        ...options,
        icon: 'ℹ️'
      });
    },

    promise: (promise, messages, options = {}) => {
      return hotToast.promise(
        promise,
        {
          loading: messages.loading || 'Loading...',
          success: messages.success || 'Success!',
          error: messages.error || 'Error occurred'
        },
        {
          ...defaultOptions,
          ...options
        }
      );
    },

    dismiss: (toastId) => {
      hotToast.dismiss(toastId);
    },

    remove: (toastId) => {
      hotToast.remove(toastId);
    }
  };

  return toast;
};

export default useToast;
