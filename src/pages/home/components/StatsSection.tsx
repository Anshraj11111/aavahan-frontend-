import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Calendar, Trophy, MapPin } from 'lucide-react';
import { generalService } from '../../../services/general';
import { formatNumber } from '../../../utils';

const StatsSection: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['homepage-stats'],
    queryFn: () => generalService.getHomepageStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const statsData = [
    {
      icon: Calendar,
      label: 'Total Events',
      value: stats?.data?.totalEvents || 50,
      color: 'text-primary-400',
      bgColor: 'bg-primary-500/20',
    },
    {
      icon: Users,
      label: 'Registered Participants',
      value: stats?.data?.totalRegistrations || 2500,
      color: 'text-secondary-400',
      bgColor: 'bg-secondary-500/20',
    },
    {
      icon: Trophy,
      label: 'Prize Pool',
      value: '₹5L+',
      color: 'text-accent-400',
      bgColor: 'bg-accent-500/20',
    },
    {
      icon: MapPin,
      label: 'Participating Colleges',
      value: 100,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
    },
  ];

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-display font-bold text-white mb-4">
            Tech Fest 2026 by the Numbers
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Join thousands of students, innovators, and tech enthusiasts in the biggest 
            technology festival of Central India.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="card text-center group hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {isLoading ? (
                    <div className="animate-pulse bg-white/20 h-8 w-16 mx-auto rounded" />
                  ) : (
                    typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value
                  )}
                </div>
                
                <p className="text-white/70 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="glass p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Why Tech Fest 2026?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h4 className="text-white font-semibold mb-2">🚀 Innovation Hub</h4>
                <p className="text-white/70 text-sm">
                  Showcase your projects, learn cutting-edge technologies, and connect with industry leaders.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">🏆 Competitions</h4>
                <p className="text-white/70 text-sm">
                  Participate in coding contests, hackathons, and technical challenges with exciting prizes.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">🎭 Cultural Events</h4>
                <p className="text-white/70 text-sm">
                  Experience the rich cultural diversity through traditional performances and ethnic celebrations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;