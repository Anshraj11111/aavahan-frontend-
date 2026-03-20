import { motion } from 'framer-motion';
import { AlertCircle, Info, Megaphone, Bell } from 'lucide-react';
import { cardHover } from '../../lib/animations';
import GlassCard from '../common/GlassCard';
import GradientBadge from '../common/GradientBadge';

/**
 * AnnouncementCard Component
 * Card for displaying announcements with type variants
 * @param {Object} props
 * @param {Object} props.announcement - Announcement data
 */
const AnnouncementCard = ({ announcement }) => {
  const { title, message, type, createdAt } = announcement;

  const typeConfig = {
    urgent: {
      icon: AlertCircle,
      variant: 'danger',
      label: 'Urgent',
      borderColor: 'border-red-500/30'
    },
    update: {
      icon: Megaphone,
      variant: 'blue',
      label: 'Update',
      borderColor: 'border-blue-500/30'
    },
    info: {
      icon: Info,
      variant: 'cyan',
      label: 'Info',
      borderColor: 'border-cyan-500/30'
    },
    reminder: {
      icon: Bell,
      variant: 'warning',
      label: 'Reminder',
      borderColor: 'border-orange-500/30'
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <motion.div variants={cardHover} whileHover="hover">
      <GlassCard 
        padding="md" 
        hover={false}
        className={`border-l-4 ${config.borderColor}`}
      >
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <Icon className="w-5 h-5 text-blue-400" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-semibold text-white text-lg">
                {title}
              </h3>
              <GradientBadge variant={config.variant} size="sm">
                {config.label}
              </GradientBadge>
            </div>

            <p className="text-gray-400 text-sm mb-3 leading-relaxed">
              {message}
            </p>

            <div className="text-xs text-gray-500">
              {formatDate(createdAt)}
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
};

export default AnnouncementCard;
