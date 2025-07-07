import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchVideos, getTrendingVideos, Video } from '../services/youtubeApi';
import VideoPlayer from '../components/VideoPlayer';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LikedVideosSection from '../components/LikedVideosSection';
import DownloadedVideosSection from '../components/DownloadedVideosSection';
import HistorySection from '../components/HistorySection';
import VideoGrid from '../components/VideoGrid';
import { useVideoHistory } from '../hooks/useVideoHistory';
import { useVideoDownload } from '../hooks/useVideoDownload';
import { ArrowLeft, PlaySquare } from 'lucide-react';

// Helper to parse ISO 8601 duration to seconds
function parseISODuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (parseInt(h || '0', 10) * 3600) + (parseInt(m || '0', 10) * 60) + (parseInt(s || '0', 10));
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showShorts, setShowShorts] = useState(false);

  const { addToHistory } = useVideoHistory();
  const { downloadVideo } = useVideoDownload();

  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['videos', searchQuery, currentSection],
    queryFn: () => {
      if (searchQuery) {
        return searchVideos(searchQuery, 40);
      } else if (currentSection === 'home') {
        return getTrendingVideos(40);
      } else {
        return [];
      }
    },
    enabled: currentSection === 'home' || searchQuery !== '',
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentSection('search');
    setSidebarOpen(false);
  };

  const handleBackToHome = () => {
    setSearchQuery('');
    setCurrentSection('home');
  };

  const handleVideoClick = (videoId: string) => {
    // Add to history when video is clicked
    const currentVideo = videos.find(video => video.id.videoId === videoId);
    if (currentVideo) {
      addToHistory(currentVideo);
    }
    
    setSelectedVideoId(videoId);
  };

  const handleClosePlayer = () => {
    setSelectedVideoId(null);
  };

  const handleSectionChange = (section: string) => {
    setCurrentSection(section);
    setSearchQuery('');
    setSidebarOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-purple-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-blue-500/20 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-orange-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {showShorts ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
          <Header onSearch={handleSearch} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex relative z-10">
            <Sidebar 
              currentSection={currentSection} 
              onSectionChange={handleSectionChange}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <main className="flex-1 lg:ml-64 pt-16 sm:pt-20 lg:pt-24 p-3 sm:p-4 lg:p-6 transition-all duration-300 px-2 sm:px-4 lg:px-6">
              <div className="max-w-7xl mx-auto">
                {/* Floating Videos Toggle Button */}
                <div className="fixed z-30 top-28 right-6 sm:top-24 sm:right-10">
                  <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-full shadow-2xl border border-white/20 px-1 py-1 relative min-w-[200px]">
                    {/* Active indicator */}
                    <div
                      className={`absolute top-1 left-1 h-[38px] w-[calc(50%-8px)] rounded-full transition-all duration-300 z-0 ${showShorts ? 'translate-x-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' : 'translate-x-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500'}`}
                      style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}
                    />
                    <button
                      className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-base transition-all duration-200
                        ${!showShorts ? 'text-white' : 'text-orange-200 hover:text-white'}`}
                      onClick={() => setShowShorts(false)}
                      aria-label="Show Videos"
                      disabled={!showShorts}
                      style={{ pointerEvents: !showShorts ? 'none' : undefined }}
                    >
                      <PlaySquare className="w-5 h-5" /> Videos
                    </button>
                    <button
                      className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-base transition-all duration-200
                        ${showShorts ? 'text-white' : 'text-blue-200 hover:text-white'}`}
                      onClick={() => setShowShorts(true)}
                      aria-label="Show Shorts"
                      disabled={showShorts}
                      style={{ pointerEvents: showShorts ? 'none' : undefined }}
                    >
                      <PlaySquare className="w-5 h-5" /> Shorts
                    </button>
                  </div>
                </div>
                <div className="glass-effect rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                  <div className="mb-6">
                    <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      Shorts
                    </h3>
                    <div className="h-1 w-32 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full mb-2" />
                  </div>
                  <VideoGrid 
                    videos={videos.filter(v => v.contentDetails && parseISODuration(v.contentDetails.duration) <= 60)}
                    isLoading={isLoading}
                    error={error}
                    onVideoClick={handleVideoClick}
                    onDownloadVideo={downloadVideo}
                  />
                </div>
              </div>
            </main>
          </div>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-30 lg:hidden transition-all duration-300"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950 relative overflow-hidden">
          <Header onSearch={handleSearch} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
          <div className="flex relative z-10">
            <Sidebar 
              currentSection={currentSection} 
              onSectionChange={handleSectionChange}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <main className="flex-1 lg:ml-64 pt-16 sm:pt-20 lg:pt-24 p-3 sm:p-4 lg:p-6 transition-all duration-300 px-2 sm:px-4 lg:px-6">
              <div className="max-w-7xl mx-auto">
                {searchQuery && (
                  <div className="mb-6 sm:mb-8">
                    <div className="glass-effect rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <button
                          onClick={handleBackToHome}
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-200"
                        >
                          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </button>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                          Search results for "{searchQuery}"
                        </h2>
                      </div>
                      <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                    </div>
                  </div>
                )}
                {/* Floating Shorts Toggle Button */}
                <div className="fixed z-30 top-28 right-6 sm:top-24 sm:right-10">
                  <div className="flex items-center bg-white/10 backdrop-blur-lg rounded-full shadow-2xl border border-white/20 px-1 py-1 relative min-w-[200px]">
                    {/* Active indicator */}
                    <div
                      className={`absolute top-1 left-1 h-[38px] w-[calc(50%-8px)] rounded-full transition-all duration-300 z-0 ${showShorts ? 'translate-x-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' : 'translate-x-0 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500'}`}
                      style={{ boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)' }}
                    />
                    <button
                      className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-base transition-all duration-200
                        ${!showShorts ? 'text-white' : 'text-orange-200 hover:text-white'}`}
                      onClick={() => setShowShorts(false)}
                      aria-label="Show Videos"
                      disabled={!showShorts}
                      style={{ pointerEvents: !showShorts ? 'none' : undefined }}
                    >
                      <PlaySquare className="w-5 h-5" /> Videos
                    </button>
                    <button
                      className={`relative z-10 flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-base transition-all duration-200
                        ${showShorts ? 'text-white' : 'text-blue-200 hover:text-white'}`}
                      onClick={() => setShowShorts(true)}
                      aria-label="Show Shorts"
                      disabled={showShorts}
                      style={{ pointerEvents: showShorts ? 'none' : undefined }}
                    >
                      <PlaySquare className="w-5 h-5" /> Shorts
                    </button>
                  </div>
                </div>
                <div className="glass-effect rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl">
                  <div className="mb-6">
                    <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                      Full Videos
                    </h3>
                    <div className="h-1 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-2" />
                  </div>
                  <VideoGrid 
                    videos={videos.filter(v => v.contentDetails && parseISODuration(v.contentDetails.duration) > 60)}
                    isLoading={isLoading}
                    error={error}
                    onVideoClick={handleVideoClick}
                    onDownloadVideo={downloadVideo}
                  />
                </div>
              </div>
            </main>
          </div>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-md z-30 lg:hidden transition-all duration-300"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      )}
      {selectedVideoId && (
        <VideoPlayer videoId={selectedVideoId} onClose={handleClosePlayer} />
      )}
    </>
  );
};

export default Index;
