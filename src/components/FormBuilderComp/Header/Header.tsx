import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useAuth } from '../../../contexts/AuthContext';
import Tooltip from '../../ui/general/tooltip/Tooltip';
import { useDispatch } from 'react-redux';
import { setFormName } from '../../../store/slices/formBuilderSlice';

interface HeaderProps {
  formName?: string;
  onFormNameChange?: (name: string) => void;
  isSaving?: boolean;
  onCopyFormUrl?: () => void;
  onPreview?: () => void;
  onGoLive?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  formName = 'Untitled Form',
  onFormNameChange,
  isSaving = false,
  onCopyFormUrl,
  onPreview,
  onGoLive
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const [editedFormName, setEditedFormName] = useState(formName);
  const [activeMenuItem, setActiveMenuItem] = useState('build');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const formNameInputRef = useRef<HTMLInputElement>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const menuItems = [
    { id: 'build', name: 'Build', icon: 'arcticons:lego-builder' },
    { id: 'configurations', name: 'Configurations', icon: 'mynaui:config-vertical-solid' },
    { id: 'analytics', name: 'Analytics', icon: 'hugeicons:analytics-02' },
    { id: 'performance-report', name: 'Performance Report', icon: 'streamline-ultimate:performance-tablet-increase' },
  ];

  // Update local state when formName prop changes
  useEffect(() => {
    setEditedFormName(formName);
  }, [formName]);

  // Debounced function to update Redux store
  const debouncedUpdateFormName = useCallback((name: string) => {
    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      dispatch(setFormName(name));
      if (onFormNameChange) {
        onFormNameChange(name);
      }
    }, 500); // 500ms delay
  }, [dispatch, onFormNameChange]);

  const handleFormNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setEditedFormName(newName);
    debouncedUpdateFormName(newName);
  };

  const handleFormNameSave = () => {
    // Clear any pending debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    dispatch(setFormName(editedFormName));
    if (onFormNameChange) {
      onFormNameChange(editedFormName);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleCopyFormUrl = () => {
    if (onCopyFormUrl) {
      onCopyFormUrl();
    }
  };

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

  const getUserDisplayName = () => {
    if (!user) return 'User';
    
    if (user.name) {
      return user.name;
    } else if (user.email) {
      return user.email.split('@')[0];
    } 
    
    return 'User';
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
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

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Left Side - Logo and Form Name */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="/images/brandLogo/brandLogo.png"
                alt="Brand Logo"
                className="h-8 w-auto"
              />
            </div>

            {/* Form Name */}
            <div className="flex items-center">
              <input
                ref={formNameInputRef}
                type="text"
                value={editedFormName}
                onChange={handleFormNameChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFormNameSave();
                  }
                }}
                className="text-lg font-semibold text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none px-1 w-64 transition-colors"
                placeholder="Enter form name..."
              />
            </div>
          </div>

          {/* Center - Menu Items */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              const isActive = activeMenuItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenuItem(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 group ${isActive
                      ? 'text-primary font-bold'
                      : 'text-gray-700 hover:text-primary'
                    }`}
                >
                  <Icon
                    icon={item.icon}
                    className={`w-4 h-4 transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary'
                      }`}
                  />
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Side - Action Buttons and User Dropdown */}
          <div className="flex items-center space-x-4">
            {/* Save Status */}
            <div className="flex items-center space-x-2 w-24 justify-center">
              {isSaving ? (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Icon icon="material-symbols:sync" className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-green-600">
                  <Icon icon="material-symbols:check-circle" className="w-4 h-4" />
                  <span className="text-sm">Saved</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Copy Form URL */}
              <Tooltip content="Copy Form URL" placement="bottom">
                <button
                onClick={handleCopyFormUrl}
                className="p-1.5 cursor-pointer text-gray-600 border border-gray-300 hover:text-primary rounded-lg transition-all duration-200"
                title="Copy Form URL"
              >
                <Icon icon="mynaui:copy" className="w-4 h-4" />
              </button>
              </Tooltip>
              {/* Preview */}
              <button
                className="p-1.5 cursor-pointer text-gray-600 border border-gray-300 hover:text-primary rounded-lg transition-all duration-200"
                onClick={onPreview}
                title="Preview Form"
              >
                <Icon icon="mage:preview" className="w-4 h-4" />
              </button>

              {/* Go Live */}
              <button
                className="flex items-center bg-primary space-x-2 p-1.5 cursor-pointer text-white border border-primary hover:bg-primary-600 rounded-lg transition-all duration-200 shadow-md"
                onClick={onGoLive}
                title="Go Live"
              >
                <Icon icon="iconoir:internet" className="w-4 h-4" />
                <span className="text-sm">Go Live</span>
              </button>
            </div>

            {/* User Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {getUserInitials()}
                </div>
  
                <Icon
                  icon="material-symbols:keyboard-arrow-down"
                  className={`w-4 h-4 text-gray-400 transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <Icon icon="material-symbols:person" className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                    <Icon icon="material-symbols:settings" className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Icon icon="material-symbols:logout" className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
