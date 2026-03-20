/**
 * SkeletonCard Component
 * Shimmer loading placeholder for cards
 * @param {Object} props
 * @param {string} props.variant - Skeleton variant: event, announcement, stat
 * @param {number} props.count - Number of skeleton cards to render
 */
const SkeletonCard = ({ variant = 'event', count = 1 }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const EventSkeleton = () => (
    <div className="glass-panel rounded-xl p-6 animate-pulse">
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-20 bg-navy-800 rounded-full" />
        <div className="h-6 w-16 bg-navy-800 rounded-full" />
      </div>
      <div className="h-7 bg-navy-800 rounded w-3/4 mb-3" />
      <div className="h-4 bg-navy-800 rounded w-full mb-2" />
      <div className="h-4 bg-navy-800 rounded w-2/3 mb-4" />
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-navy-800 rounded w-1/2" />
        <div className="h-4 bg-navy-800 rounded w-2/3" />
      </div>
      <div className="flex justify-between pt-4 border-t border-white/10">
        <div className="h-4 bg-navy-800 rounded w-20" />
        <div className="h-4 bg-navy-800 rounded w-24" />
      </div>
    </div>
  );

  const AnnouncementSkeleton = () => (
    <div className="glass-panel rounded-xl p-4 animate-pulse">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-navy-800 rounded-full flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between mb-2">
            <div className="h-5 bg-navy-800 rounded w-1/2" />
            <div className="h-5 w-16 bg-navy-800 rounded-full" />
          </div>
          <div className="h-4 bg-navy-800 rounded w-full mb-2" />
          <div className="h-4 bg-navy-800 rounded w-3/4 mb-3" />
          <div className="h-3 bg-navy-800 rounded w-20" />
        </div>
      </div>
    </div>
  );

  const StatSkeleton = () => (
    <div className="glass-panel rounded-xl p-8 text-center animate-pulse">
      <div className="w-16 h-16 bg-navy-800 rounded-full mx-auto mb-4" />
      <div className="h-10 bg-navy-800 rounded w-24 mx-auto mb-2" />
      <div className="h-4 bg-navy-800 rounded w-32 mx-auto" />
    </div>
  );

  const variants = {
    event: EventSkeleton,
    announcement: AnnouncementSkeleton,
    stat: StatSkeleton
  };

  const SkeletonComponent = variants[variant] || EventSkeleton;

  return (
    <>
      {skeletons.map((i) => (
        <SkeletonComponent key={i} />
      ))}
    </>
  );
};

export default SkeletonCard;
