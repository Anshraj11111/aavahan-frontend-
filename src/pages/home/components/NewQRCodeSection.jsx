import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Smartphone, Calendar, ArrowRight, Sparkles } from 'lucide-react';

const NewQRCodeSection = () => {
  const scheduleUrl = `${window.location.origin}/schedule`;

  return (
    <section className="py-20 relative bg-red-500 overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.2
            }}
          />
        ))}
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Quick <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Access</span>
            </h2>
            <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
          </div>
          <p className="text-gray-300 text-lg font-semibold">Scan to view the complete event schedule</p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto rounded-full shadow-lg shadow-purple-500/50 mt-4" />
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* QR Code Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="relative group">
                {/* Glowing Border Animation */}
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 animate-pulse transition-opacity" />
                
                {/* QR Code Container */}
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  
                  <QRCodeSVG
                    value={scheduleUrl}
                    size={280}
                    level="H"
                    includeMargin={true}
                    className="mx-auto"
                  />
                  
                  <div className="mt-6 text-center">
                    <p className="text-gray-800 font-black text-lg mb-1">Scan with your phone</p>
                    <p className="text-gray-600 font-semibold text-sm">Get instant access to schedule</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Instructions & Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* How to Scan */}
              <div className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-6 border-2 border-blue-400/30 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white">How to Scan</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-black text-sm">1</span>
                    </div>
                    <p className="text-gray-200 font-semibold">Open your phone's camera app</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-black text-sm">2</span>
                    </div>
                    <p className="text-gray-200 font-semibold">Point it at the QR code</p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white font-black text-sm">3</span>
                    </div>
                    <p className="text-gray-200 font-semibold">Tap the notification to view schedule</p>
                  </div>
                </div>
              </div>

              {/* What You'll See */}
              <div className="bg-blue-900/30 backdrop-blur-md rounded-2xl p-6 border-2 border-cyan-400/30 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-white">What You'll See</h3>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <p className="text-gray-200 font-semibold">Day 1, Day 2, Day 3 schedules</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <p className="text-gray-200 font-semibold">Event timings & venues</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <p className="text-gray-200 font-semibold">Registration status & details</p>
                  </div>
                </div>
              </div>

              {/* Alternative Link */}
              <motion.a
                href="/schedule"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-black py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 group"
              >
                <span>Or View in Browser</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewQRCodeSection;
