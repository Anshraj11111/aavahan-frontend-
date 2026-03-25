import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QrCode, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingQRButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scheduleUrl, setScheduleUrl] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Get the full URL dynamically - works in localhost and production
    const fullUrl = `${window.location.protocol}//${window.location.host}/schedule`;
    setScheduleUrl(fullUrl);
  }, []);

  // Lock body scroll and ensure modal is visible when opened
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.height = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* QR Button - Positioned within hero section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-8 flex justify-end"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
        >
          <QrCode className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Schedule QR
          </span>
        </button>
      </motion.div>

      {/* QR Code Modal */}
      {isOpen && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop with Flexbox Centering */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 99998,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '1rem',
                }}
              >
                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 50 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    maxWidth: '26rem',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                  }}
                >
                  <div className="bg-gradient-to-br from-[#1a2744] via-[#0f1f3d] to-[#0a1628] rounded-xl sm:rounded-2xl p-3 sm:p-6 shadow-2xl border-2 border-cyan-400/30 relative">
                    {/* Close Button */}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-red-500/20 hover:bg-red-500/30 rounded-full flex items-center justify-center transition-colors group z-10"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 group-hover:rotate-90 transition-transform" />
                    </button>

                    {/* Title */}
                    <div className="text-center mb-2 sm:mb-3">
                      <h2 className="text-base sm:text-2xl font-black text-white mb-0.5 sm:mb-1">
                        Schedule <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">QR Code</span>
                      </h2>
                      <p className="text-gray-300 text-[9px] sm:text-xs">Scan to view complete event schedule</p>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center mb-2 sm:mb-3">
                      <div className="relative">
                        {/* QR Code Container */}
                        <div className="relative bg-white rounded-lg sm:rounded-xl p-2 sm:p-4 shadow-xl">
                          {scheduleUrl ? (
                            <QRCodeSVG
                              value={scheduleUrl}
                              size={150}
                              level="H"
                              className="mx-auto w-[150px] h-[150px] sm:w-[200px] sm:h-[200px]"
                            />
                          ) : (
                            <div className="w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] flex items-center justify-center text-gray-400 text-xs">
                              Loading...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Instructions - Hidden on mobile, shown on desktop */}
                    <div className="hidden sm:block bg-blue-900/30 backdrop-blur-md rounded-lg p-3 border border-blue-400/30 mb-3">
                      <h3 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                        <span className="w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center text-xs">📱</span>
                        How to Scan
                      </h3>
                      <ol className="space-y-1.5 text-gray-200 text-xs">
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">1.</span>
                          <span>Open your phone's camera app</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">2.</span>
                          <span>Point it at the QR code</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 font-bold">3.</span>
                          <span>Tap the notification to view schedule</span>
                        </li>
                      </ol>
                    </div>

                    {/* Mobile-only compact instruction */}
                    <div className="sm:hidden text-center mb-2">
                      <p className="text-gray-300 text-[9px]">📱 Point your camera at the QR code</p>
                    </div>

                    {/* Alternative Link */}
                    <div className="text-center">
                      <a
                        href="/schedule"
                        onClick={() => setIsOpen(false)}
                        className="text-cyan-400 hover:text-cyan-300 text-[9px] sm:text-xs font-semibold transition-colors"
                      >
                        Or view in browser →
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default FloatingQRButton;
