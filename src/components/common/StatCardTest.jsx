import React from 'react';
import { Users } from 'lucide-react';

// Simple test component to isolate StatCard issues
const StatCardTest = () => {
  return (
    <div className="p-8 bg-gray-900 text-white">
      <h2 className="text-xl mb-4">StatCard Test</h2>
      <div className="glass-panel rounded-xl border border-white/10 glow-border p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400">
          <Users size={32} />
        </div>
        <div className="text-4xl md:text-5xl font-display font-bold gradient-text mb-2">
          1000+
        </div>
        <div className="text-sm md:text-base text-gray-400 font-medium">Test Users</div>
      </div>
    </div>
  );
};

export default StatCardTest;