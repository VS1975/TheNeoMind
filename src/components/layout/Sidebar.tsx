import { NavLink, useLocation } from 'react-router-dom';
import { FiHome, FiFileText, FiTarget, FiCalendar, FiCheckCircle, FiMenu } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  // Close sidebar when location changes (on mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navItems = [
    { to: '/dashboard', icon: FiHome, label: 'Dashboard' },
    { to: '/notes', icon: FiFileText, label: 'Notes' },
    { to: '/goals', icon: FiTarget, label: 'Goals' },
    { to: '/scheduler', icon: FiCalendar, label: 'Scheduler' },
    { to: '/review', icon: FiCheckCircle, label: 'Review' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-lg md:hidden"
        aria-label="Toggle menu"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-card text-card-foreground shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              NeoMind
            </h1>
            <p className="text-sm text-muted-foreground">Welcome, {currentUser?.displayName?.split(' ')[0] || 'User'}</p>
          </div>
          
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`
                    }
                  >
                    <item.icon className="mr-3 w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              NeoMind v1.0.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
