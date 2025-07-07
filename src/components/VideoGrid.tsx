import React from 'react';
import VideoCard from './VideoCard';
import { Video } from '../services/youtubeApi';
import { Loader2 } from 'lucide-react';

interface VideoGridProps {
  videos: Video[];
  isLoading: boolean;
  error: any;
  onVideoClick: (videoId: string) => void;
  onDownloadVideo: (video: Video, format: 'mp3' | 'mp4') => Promise<void>;
}

const VideoGrid: React.FC<VideoGridProps> = ({ 
  videos, 
  isLoading, 
  error, 
  onVideoClick, 
  onDownloadVideo
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16 sm:py-24 lg:py-32">
        <div className="glass-effect rounded-2xl p-6 sm:p-8 border border-white/20 text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <span className="text-white text-lg sm:text-xl font-medium">Loading amazing videos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 sm:py-24 lg:py-32">
        <div className="glass-effect rounded-2xl p-6 sm:p-8 border border-red-500/30 bg-red-500/10 max-w-md mx-auto">
          <div className="text-red-400 text-lg sm:text-xl mb-2 font-medium">Failed to load videos</div>
          <div className="text-slate-300">Please try again later</div>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-16 sm:py-24 lg:py-32">
        <div className="glass-effect rounded-2xl p-6 sm:p-8 border border-white/20 max-w-md mx-auto">
          <div className="text-slate-300 text-lg sm:text-xl font-medium">No videos found</div>
          <div className="text-slate-400 mt-2">Try a different search term</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {videos.map((video, index) => (
        <div
          key={`${video.id.videoId}-${index}`}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <VideoCard 
            video={video} 
            onClick={onVideoClick}
            onDownloadMp3={() => onDownloadVideo(video, 'mp3')}
            onDownloadMp4={() => onDownloadVideo(video, 'mp4')}
          />
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;
