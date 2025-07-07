import { Video } from '../services/youtubeApi';

export const useVideoHistory = () => {
  const addToHistory = (video: Video) => {
    const history = JSON.parse(localStorage.getItem('video_history') || '[]');
    
    // Remove if already exists to avoid duplicates
    const filteredHistory = history.filter((v: any) => v.id?.videoId !== video.id.videoId);
    
    // Add to beginning of history with timestamp
    const videoWithHistory = {
      ...video,
      watchedAt: new Date().toISOString()
    };
    
    filteredHistory.unshift(videoWithHistory);
    
    // Keep only last 50 videos in history
    const limitedHistory = filteredHistory.slice(0, 50);
    
    localStorage.setItem('video_history', JSON.stringify(limitedHistory));
    console.log('Added to history:', video.snippet.title);
  };

  return { addToHistory };
};
