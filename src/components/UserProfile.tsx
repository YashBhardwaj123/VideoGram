
import React from 'react';
import { User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface UserProfileProps {
  user: SupabaseUser;
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSignOut }) => {
  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const avatar = user.user_metadata?.avatar_url;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300 group"
        >
          {avatar ? (
            <img 
              src={avatar} 
              alt="Profile" 
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-300" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="glass-effect border border-white/20 bg-slate-950/90 text-white"
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium">{displayName}</p>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-white/20" />
        <DropdownMenuItem 
          onClick={onSignOut}
          className="hover:bg-white/10 focus:bg-white/10 cursor-pointer"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
