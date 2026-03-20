/**
 * StatusBadge Component
 * Badge for displaying status with status-specific colors
 * @param {Object} props
 * @param {string} props.status - Status value: approved, pending, rejected, checked-in, etc.
 * @param {string} props.size - Size: sm, md, lg
 */
const StatusBadge = ({ status, size = 'md' }) => {
  const statusConfig = {
    approved: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      label: 'Approved'
    },
    pending: {
      bg: 'bg-yellow-500/20',
      text: 'text-yellow-400',
      border: 'border-yellow-500/30',
      label: 'Pending'
    },
    rejected: {
      bg: 'bg-red-500/20',
      text: 'text-red-400',
      border: 'border-red-500/30',
      label: 'Rejected'
    },
    'checked-in': {
      bg: 'bg-blue-500/20',
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      label: 'Checked In'
    },
    active: {
      bg: 'bg-green-500/20',
      text: 'text-green-400',
      border: 'border-green-500/30',
      label: 'Active'
    },
    inactive: {
      bg: 'bg-gray-500/20',
      text: 'text-gray-400',
      border: 'border-gray-500/30',
      label: 'Inactive'
    },
    completed: {
      bg: 'bg-purple-500/20',
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      label: 'Completed'
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border font-medium backdrop-blur-sm ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.text.replace('text-', 'bg-')}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
