import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, AlertCircle, Info, Megaphone } from 'lucide-react';
import { announcementsService } from '../../../services/announcements';
import { getRelativeTime } from '../../../utils';

const AnnouncementsSection: React.FC = () => {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: () => announcementsService.getActiveAnnouncements(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const announcementsList = announcements?.data || [];

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return AlertCircle;
      case 'update':
        return Megaphone;
      default:
        return Info;
    }
  };

  const getAnnouncementStyle = (type: string) => {
    switch (type) {
      case 'urgent':
        return 'border-red-500/50 bg-red-500/10';
      case 'update':
        return 'border-yellow-500/50 bg-yellow-500/10';
      default:
        return 'border-blue-500/50 bg-blue-500/10';
    }
  };

  if (!isLoading && announcementsList.length === 0) {
    return null;
  }

  return (
    <section className="py-16 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-primary-400 mr-3" />
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">
              Latest Announcements
            </h2>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Stay updated with the latest news and important information about Tech Fest 2026.
          </p>
        </div>

        {/* Announcements List */}
        {isLoading ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="glass p-6 rounded-lg animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-white/20 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-white/20 h-4 rounded w-3/4" />
                    <div className="bg-white/20 h-3 rounded w-full" />
                    <div className="bg-white/20 h-3 rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {announcementsList.slice(0, 5).map((announcement, index) => {
              const Icon = getAnnouncementIcon(announcement.type);
              return (
                <div
                  key={announcement._id}
                  className={`glass border-l-4 p-6 rounded-lg transition-all duration-300 hover:scale-[1.02] ${getAnnouncementStyle(announcement.type)}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      announcement.type === 'urgent' 
                        ? 'bg-red-500/20 text-red-400'
                        : announcement.type === 'update'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      <Icon size={20} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-semibold text-lg">
                          {announcement.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            announcement.type === 'urgent'
                              ? 'bg-red-500 text-white'
                              : announcement.type === 'update'
                              ? 'bg-yellow-500 text-black'
                              : 'bg-blue-500 text-white'
                          }`}>
                            {announcement.type.toUpperCase()}
                          </span>
                          <span className="text-white/50 text-sm">
                            {getRelativeTime(announcement.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-white/80 leading-relaxed">
                        {announcement.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Important Notice */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="glass border border-primary-500/50 p-6 rounded-lg bg-primary-500/10">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-500/20 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  Stay Connected
                </h3>
                <p className="text-white/80 mb-4">
                  Follow our social media channels and join our WhatsApp groups for real-time updates, 
                  event notifications, and important announcements.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://instagram.com/sriramgroup"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200"
                  >
                    Follow on Instagram
                  </a>
                  <a
                    href="https://facebook.com/SriRamGroupJabalpur"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200"
                  >
                    Like on Facebook
                  </a>
                  <a
                    href="https://wa.me/919755042292"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:scale-105 transition-transform duration-200"
                  >
                    Join WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnnouncementsSection;