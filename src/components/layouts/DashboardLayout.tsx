import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  // Get user data from AuthContext
  const { user, logout } = useAuth();

  const menuItems = [
    { name: 'DASHBOARD', path: '/dashboard', icon: 'material-symbols:dashboard' },
    { name: 'PERFORMANCE', path: '/performance', icon: 'hugeicons:laptop-performance' },
    { name: 'LEAD ANALYTICS', path: '/lead-analytics', icon: 'hugeicons:analytics-up' },
  ];

  // Generate user initials from name or email
  const getUserInitials = () => {
    if (!user) return 'U';
    
    if (user.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
      } else {
        return nameParts[0].charAt(0).toUpperCase();
      }
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return 'U';
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    if (user.name) {
      return user.name;
    } else if (user.email) {
      return user.email.split('@')[0];
    } 
    
    return 'User';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            <div className='flex items-center space-x-10'>
              {/* Logo/Brand */}
              <div className="flex items-center">
                <Link to="/dashboard" className="flex items-center">
                  <img 
                    src="./images/brandLogo/brandLogo.png" 
                    alt="Brand Logo" 
                    className="h-8 w-auto"
                  />
                </Link>
              </div>

              {/* Navigation Menu */}
              <nav className="hidden lg:flex items-center space-x-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-1 px-2 py-2 rounded-lg transition-all duration-200 group ${
                        isActive 
                          ? 'text-primary font-bold' 
                          : 'text-gray-700 hover:text-primary'
                      }`}
                    >
                      <Icon 
                        icon={item.icon} 
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-primary' : 'group-hover:text-primary'
                        }`} 
                      />
                      <span className="text-xs font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center space-x-4">
            
              {/* User Profile Section */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-700 hover:text-primary hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{getUserInitials()}</span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                  </div>
                  <Icon 
                    icon="material-symbols:keyboard-arrow-down" 
                    className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* User Dropdown */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                    </div>
                    
                    <div className="py-1">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-primary/5 flex items-center space-x-2">
                        <Icon icon="material-symbols:account-balance" className="w-4 h-4" />
                        <span>Billing</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-primary/5 flex items-center space-x-2">
                        <Icon icon="material-symbols:settings" className="w-4 h-4" />
                        <span>Settings</span>
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-primary hover:bg-primary/5 flex items-center space-x-2">
                        <Icon icon="material-symbols:person-add" className="w-4 h-4" />
                        <span>Add Users</span>
                      </button>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-1">
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <Icon icon="material-symbols:logout" className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with top padding to account for fixed header */}
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};
