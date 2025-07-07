
import React from 'react';
import VideoCard from './VideoCard';
import { Video } from '../services/youtubeApi';

interface LikedVideosSectionProps {
  onVideoClick: (videoId: string) => void;
  onDownloadVideo: (video: Video, format: 'mp3' | 'mp4') => Promise<void>;
}

const LikedVideosSection: React.FC<LikedVideosSectionProps> = ({ 
  onVideoClick, 
  onDownloadVideo 
}) => {
  const likedVideos = JSON.parse(localStorage.getItem('liked_videos') || '[]');

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <div className="glass-effect rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Liked Videos
          </h2>
          <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mt-3"></div>
        </div>
      </div>
      
      {likedVideos.length === 0 ? (
        <div className="text-center py-16 sm:py-24 lg:py-32">
          <div className="glass-effect rounded-2xl p-6 sm:p-8 border border-white/20 max-w-md mx-auto">
            <div className="text-slate-300 text-lg sm:text-xl font-medium">No liked videos</div>
            <div className="text-slate-400 mt-2">Like some videos to see them here!</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {likedVideos.map((video: any, index: number) => (
            <VideoCard 
              key={`${video.id.videoId}-${index}`} 
              video={video} 
              onClick={onVideoClick}
              onDownloadMp3={() => onDownloadVideo(video, 'mp3')}
              onDownloadMp4={() => onDownloadVideo(video, 'mp4')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedVideosSection;
