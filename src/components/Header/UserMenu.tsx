
import { User, Settings, Heart, LogIn, UserPlus, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserMenu = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-2 text-white hover:text-primary transition-colors duration-200">
        <User size={20} />
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        {user ? (
          <>
            <DropdownMenuItem asChild>
              <Link to="/account" className="flex items-center">
                <Heart className="mr-2 h-4 w-4" />
                View Saved Items
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/account" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link to="/auth" className="flex items-center">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link to="/auth" className="flex items-center">
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
