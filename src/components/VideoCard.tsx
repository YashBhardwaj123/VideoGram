import React from 'react';
import { Video } from '../services/youtubeApi';
import { Play, Eye, Download, Music, Video as VideoIcon } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onClick: (videoId: string) => void;
  onDownloadMp3?: () => void;
  onDownloadMp4?: () => void;
  showDownloadDate?: boolean;
  showWatchDate?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({ 
  video, 
  onClick, 
  onDownloadMp3, 
  onDownloadMp4, 
  showDownloadDate = false,
  showWatchDate = false
}) => {
  const formatViews = (viewCount: string) => {
    const views = parseInt(viewCount);
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  const handleDownloadClick = (e: React.MouseEvent, downloadFn: () => void) => {
    e.stopPropagation();
    downloadFn();
  };

  return (
    <div className="glass-effect rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 group hover:shadow-2xl hover:shadow-orange-500/10 transform hover:scale-105">
      <div className="relative overflow-hidden">
        <img
          src={video.snippet.thumbnails.high.url}
          alt={video.snippet.title}
          className="w-full h-32 sm:h-40 lg:h-48 object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
          onClick={() => onClick(video.id.videoId)}
        />
        {/* Overlay with play button */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center cursor-pointer"
             onClick={() => onClick(video.id.videoId)}>
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" fill="currentColor" />
          </div>
        </div>
        {/* Download buttons */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          {onDownloadMp3 && (
            <button
              onClick={(e) => handleDownloadClick(e, onDownloadMp3)}
              className="w-8 h-8 bg-green-500/80 hover:bg-green-500 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 transition-all duration-200 hover:scale-110"
              title="Download MP3"
            >
              <Music className="w-4 h-4 text-white" />
            </button>
          )}
          {onDownloadMp4 && (
            <button
              onClick={(e) => handleDownloadClick(e, onDownloadMp4)}
              className="w-8 h-8 bg-blue-500/80 hover:bg-blue-500 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 transition-all duration-200 hover:scale-110"
              title="Download MP4"
            >
              <VideoIcon className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      </div>
      <div className="p-3 sm:p-4 lg:p-5">
        <h3 className="text-white font-semibold text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 line-clamp-2 group-hover:text-orange-300 transition-colors duration-300 cursor-pointer"
            onClick={() => onClick(video.id.videoId)}>
          {video.snippet.title}
        </h3>
        <div className="space-y-1 sm:space-y-2">
          <p className="text-slate-300 text-xs sm:text-sm font-medium hover:text-white transition-colors duration-300 truncate">
            {video.snippet.channelTitle}
          </p>
          <div className="flex items-center space-x-2 sm:space-x-4 text-slate-400 text-xs sm:text-sm">
            {video.statistics && (
              <>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{formatViews(video.statistics.viewCount)}</span>
                </div>
                <span>•</span>
              </>
            )}
            <span className="truncate">
              {showDownloadDate && (video as any).downloadedAt
                ? `Downloaded: ${new Date((video as any).downloadedAt).toLocaleDateString()}`
                : showWatchDate && (video as any).watchedAt
                ? `Watched: ${new Date((video as any).watchedAt).toLocaleDateString()}`
                : new Date(video.snippet.publishedAt).toLocaleDateString()
              }
            </span>
          </div>
        </div>
        {/* Download buttons for mobile */}
        <div className="flex gap-2 mt-3 sm:hidden">
          {onDownloadMp3 && (
            <button
              onClick={(e) => handleDownloadClick(e, onDownloadMp3)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 min-h-[44px] bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-300 text-xs font-medium transition-all duration-200"
            >
              <Music className="w-3 h-3" />
              MP3
            </button>
          )}
          {onDownloadMp4 && (
            <button
              onClick={(e) => handleDownloadClick(e, onDownloadMp4)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-3 min-h-[44px] bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 text-xs font-medium transition-all duration-200"
            >
              <VideoIcon className="w-3 h-3" />
              MP4
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
