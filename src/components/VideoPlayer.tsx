
import React, { useEffect, useState } from 'react';
import { VideoDetails, getVideoDetails } from '../services/youtubeApi';
import { X, Eye, ThumbsUp, ArrowLeft } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onClose }) => {
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setLoading(true);
      const details = await getVideoDetails(videoId);
      setVideoDetails(details);
      setLoading(false);
    };

    fetchVideoDetails();
    
    // Check if video is already liked
    const likedVideos = JSON.parse(localStorage.getItem('liked_videos') || '[]');
    const isVideoLiked = likedVideos.some((video: any) => video.id?.videoId === videoId);
    setIsLiked(isVideoLiked);
  }, [videoId]);

  const formatNumber = (num: string) => {
    const number = parseInt(num);
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + 'M';
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + 'K';
    }
    return number.toString();
  };

  const handleLike = () => {
    if (!videoDetails) return;
    
    const likedVideos = JSON.parse(localStorage.getItem('liked_videos') || '[]');
    
    if (isLiked) {
      // Remove from liked videos
      const updatedLikedVideos = likedVideos.filter((video: any) => video.id?.videoId !== videoId);
      localStorage.setItem('liked_videos', JSON.stringify(updatedLikedVideos));
      setIsLiked(false);
    } else {
      // Add to liked videos - create proper video object structure
      const videoToSave = {
        id: { videoId },
        snippet: {
          title: videoDetails.snippet.title,
          channelTitle: videoDetails.snippet.channelTitle,
          publishedAt: videoDetails.snippet.publishedAt,
          description: videoDetails.snippet.description,
          thumbnails: videoDetails.snippet.thumbnails
        },
        statistics: videoDetails.statistics,
        likedAt: new Date().toISOString()
      };
      likedVideos.push(videoToSave);
      localStorage.setItem('liked_videos', JSON.stringify(likedVideos));
      setIsLiked(true);
    }
  };

  if (loading || !videoDetails) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 z-50 overflow-y-auto">
      <div className="min-h-screen pb-4">
        {/* Header with back button */}
        <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-white/15 hover:bg-white/25 rounded-lg px-4 py-2 transition-colors duration-200 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <button
            onClick={onClose}
            className="bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-200"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Video content */}
        <div className="px-4 pb-4">
          <div className="max-w-6xl mx-auto">
            {/* Video player */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={videoDetails.snippet.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>

            {/* Video info */}
            <div className="glass-effect rounded-xl p-6 border border-white/10">
              {/* Title */}
              <h1 className="text-2xl font-bold text-white mb-4 leading-relaxed">
                {videoDetails.snippet.title}
              </h1>

              {/* Channel and stats */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="text-slate-300 font-medium">
                  {videoDetails.snippet.channelTitle}
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">
                      {formatNumber(videoDetails.statistics.viewCount)} views
                    </span>
                  </div>

                  <button 
                    onClick={handleLike}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all duration-200 ${
                      isLiked 
                        ? 'bg-red-500/20 border border-red-500/30 text-red-400' 
                        : 'bg-slate-800/50 hover:bg-slate-700/50 text-white border border-slate-700/50'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    <span>
                      {isLiked ? 'Liked' : formatNumber(videoDetails.statistics.likeCount)}
                    </span>
                  </button>
                </div>
              </div>

              {/* Description */}
              <div className="text-slate-300 leading-relaxed space-y-3">
                {videoDetails.snippet.description.split('\n').slice(0, 8).map((line, index) => (
                  <p key={index} className="break-words">{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
