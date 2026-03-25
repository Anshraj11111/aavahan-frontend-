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

  const buttonContent = (
    <>
      {/* Floating QR Button - Using Portal to render directly in body */}
      <div
        style={{
          position: 'fixed',
          top: '6rem',
          right: '1.5rem',
          zIndex: 99999,
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '3.5rem',
            height: '3.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to right, #a855f7, #06b6d4)',
            borderRadius: '9999px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(168, 85, 247, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
        >
          <QrCode style={{ width: '1.5rem', height: '1.5rem', color: 'white', pointerEvents: 'none' }} />
        </button>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
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
              }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: '5vh',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 100000,
                width: '92%',
                maxWidth: '26rem',
                maxHeight: '85vh',
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
                <div className="text-center mb-2 sm:mb-4">
                  <h2 className="text-lg sm:text-2xl font-black text-white mb-0.5 sm:mb-1">
                    Schedule <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">QR Code</span>
                  </h2>
                  <p className="text-gray-300 text-[10px] sm:text-xs">Scan to view complete event schedule</p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-2 sm:mb-4">
                  <div className="relative">
                    {/* QR Code Container */}
                    <div className="relative bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-4 shadow-xl">
                      {scheduleUrl ? (
                        <QRCodeSVG
                          value={scheduleUrl}
                          size={160}
                          level="H"
                          className="mx-auto w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]"
                        />
                      ) : (
                        <div className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] flex items-center justify-center text-gray-400 text-xs">
                          Loading...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-900/30 backdrop-blur-md rounded-lg p-2 sm:p-3 border border-blue-400/30">
                  <h3 className="text-white font-bold text-[10px] sm:text-xs mb-1 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                    <span className="w-3.5 h-3.5 sm:w-5 sm:h-5 bg-cyan-500 rounded-full flex items-center justify-center text-[10px]">📱</span>
                    How to Scan
                  </h3>
                  <ol className="space-y-0.5 sm:space-y-1.5 text-gray-200 text-[10px] sm:text-xs">
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-cyan-400 font-bold">1.</span>
                      <span>Open your phone's camera app</span>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-cyan-400 font-bold">2.</span>
                      <span>Point it at the QR code</span>
                    </li>
                    <li className="flex items-start gap-1.5 sm:gap-2">
                      <span className="text-cyan-400 font-bold">3.</span>
                      <span>Tap the notification to view schedule</span>
                    </li>
                  </ol>
                </div>

                {/* Alternative Link */}
                <div className="mt-2 sm:mt-3 text-center">
                  <a
                    href="/schedule"
                    onClick={() => setIsOpen(false)}
                    className="text-cyan-400 hover:text-cyan-300 text-[10px] sm:text-xs font-semibold transition-colors"
                  >
                    Or view in browser →
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );

  // Render using Portal directly to document.body
  return createPortal(buttonContent, document.body);
};

export default FloatingQRButton;
