import React, { useState } from 'react';
import { PlaySquare, Menu, LogIn } from 'lucide-react';
import SearchBar from './SearchBar';
import AuthDialog from './AuthDialog';
import UserProfile from './UserProfile';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface HeaderProps {
  onSearch: (query: string) => void;
  onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onMenuToggle }) => {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      setAuthDialogOpen(false);
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error('Failed to sign in: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error: any) {
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 glass-effect border-b border-white/10 z-50 backdrop-blur-xl">
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 lg:hidden group"
          >
            <Menu className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/25">
              <PlaySquare className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              VideoGram
            </span>
          </div>
        </div>

        <div className="flex-1 max-w-xs sm:max-w-md lg:max-w-2xl mx-2 sm:mx-4">
          <SearchBar onSearch={onSearch} />
        </div>

        <div className="flex items-center">
          {loading ? (
            <div className="w-8 h-8 animate-pulse bg-white/20 rounded-full"></div>
          ) : user ? (
            <UserProfile user={user} onSignOut={handleSignOut} />
          ) : (
            <Button
              onClick={() => setAuthDialogOpen(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 group bg-transparent border-none"
            >
              <LogIn className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
            </Button>
          )}
        </div>
      </div>

      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        onGoogleSignIn={handleGoogleSignIn}
      />
    </header>
  );
};

export default Header;
