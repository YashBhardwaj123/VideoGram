import React from 'react';
import { Home, Heart, Clock, Download, FileAudio, FileVideo } from 'lucide-react';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  isOpen?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSectionChange, isOpen = false }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'liked', label: 'Liked Videos', icon: Heart },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'downloaded_mp4', label: 'Downloaded MP4', icon: FileVideo },
    { id: 'downloaded_mp3', label: 'Downloaded MP3', icon: FileAudio },
  ];

  return (
    <div className={`fixed left-0 top-0 h-full w-64 sm:w-72 lg:w-64 glass-effect border-r border-white/10 z-40 p-4 sm:p-6 backdrop-blur-xl transform transition-transform duration-300 ease-out lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="pt-20 sm:pt-24">
        <nav className="space-y-2 sm:space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center space-x-3 sm:space-x-4 px-3 sm:px-4 py-3 sm:py-4 rounded-xl transition-all duration-300 group text-left ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500/20 via-pink-500/20 to-purple-500/20 text-orange-300 border border-orange-500/30 shadow-lg shadow-orange-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-white/10 hover:scale-105'
                }`}
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-300 flex-shrink-0 ${isActive ? 'text-orange-400' : 'group-hover:scale-110'}`} />
                <span className="font-medium text-sm sm:text-base truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
        <div className="glass-effect rounded-xl p-3 sm:p-4 border border-white/10">
          <div className="text-xs text-slate-400 text-center">
            <p>© 2024 VideoGram</p>
            <p className="mt-1">Professional Video Platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
