import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { loading } = useAuth();
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only access theme after component is mounted to avoid SSR issues
  const { theme } = useTheme();

  if (loading || !isMounted) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`flex h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background text-foreground transition-colors duration-200">
            <div className="max-w-7xl mx-auto w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
 
export default MainLayout;
