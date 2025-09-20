import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { FiLogOut, FiSun, FiMoon, FiUser } from 'react-icons/fi';
import { auth } from '../../utils/firebase';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-background border-b border-border">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
        </button>
      </div>
      
      <div className="relative">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex items-center space-x-2 p-1 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <FiUser className="w-4 h-4 text-primary" />
          </div>
        </button>
        
        {isProfileOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-popover text-popover-foreground rounded-md shadow-lg py-1 z-50 border border-border">
            <div className="px-4 py-2 text-sm border-b border-border">
              <p className="font-medium">{auth.currentUser?.displayName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{auth.currentUser?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center"
            >
              <FiLogOut className="mr-2" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
