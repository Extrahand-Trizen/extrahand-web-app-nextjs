'use client';

/**
 * NavBar Component
 * Navigation bar with hamburger menu for dashboard pages
 * Matches: web-apps/extrahand-web-app/src/components/MobileNavBar.tsx
 */

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/context';

const DARK = '#222';

interface NavBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ 
  title, 
  showBackButton = false, 
  onBackPress 
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, userData, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuPress = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (route: string, label?: string) => {
    setIsMenuOpen(false);
    
    // Special handling for My Tasks navigation
    if (label === 'My Tasks') {
      router.push('/performer?tab=my-tasks');
      return;
    }
    
    // Map routes to Next.js paths
    const routeMap: Record<string, string> = {
      'PerformerHome': '/performer',
      'PosterHome': '/poster',
      'TaskListing': '/tasks',
      'TaskPostingForm': '/tasks/new',
      'MyApplications': '/applications',
      'Chat': '/chat',
      'Profile': '/profile',
    };
    
    const path = routeMap[route] || route;
    router.push(path);
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const menuItems = [
    { label: 'Home', route: 'PerformerHome', icon: '⌂' },
    { label: 'Browse Tasks', route: 'TaskListing', icon: '☐' },
    { label: 'Post a Task', route: 'TaskPostingForm', icon: '＋' },
    { label: 'My Tasks', route: 'PerformerHome', icon: '📋' },
    { label: 'My Applications', route: 'MyApplications', icon: '📝' },
    { label: 'Chat', route: 'Chat', icon: '💬' },
    { label: 'Profile', route: 'Profile', icon: '👤' },
    { label: 'Settings', route: 'Profile', icon: '⚙️' },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-menu-container') && !target.closest('.hamburger-button')) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
      {/* Navigation Bar */}
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200 h-[60px]">
        {/* Left: Back Button or Logo */}
        <div className="flex-1 flex items-start">
          {showBackButton ? (
            <button onClick={handleBackPress} className="p-2">
              <span className="text-xl font-bold" style={{ color: DARK }}>←</span>
            </button>
          ) : (
            <button
              onClick={() => router.push('/poster')}
              className="flex items-center cursor-pointer"
            >
              <Image
                src="/assets/images/logo.png"
                alt="Extrahand Logo"
                width={32}
                height={32}
                className="mr-2"
              />
              <span className="text-lg font-bold" style={{ color: DARK }}>Extrahand</span>
            </button>
          )}
        </div>

        {/* Center: Title (if provided) */}
        {title && (
          <div className="flex-2 flex items-center justify-center">
            <span className="text-base font-semibold" style={{ color: DARK }}>{title}</span>
          </div>
        )}

        {/* Right: Hamburger Menu */}
        <div className="flex-1 flex items-end justify-end">
          <button onClick={handleMenuPress} className="p-2 hamburger-button">
            <div className="w-5 h-4 flex flex-col justify-between">
              <div className="h-0.5 bg-gray-800 rounded"></div>
              <div className="h-0.5 bg-gray-800 rounded"></div>
              <div className="h-0.5 bg-gray-800 rounded"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Menu Modal */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="nav-menu-container fixed top-0 right-0 w-[80%] max-w-[300px] h-full bg-white shadow-lg z-50">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push('/poster');
                  }}
                  className="flex items-center cursor-pointer"
                >
                  <Image
                    src="/assets/images/logo.png"
                    alt="Extrahand Logo"
                    width={32}
                    height={32}
                    className="mr-2"
                  />
                  <span className="text-lg font-bold" style={{ color: DARK }}>Extrahand</span>
                </button>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2"
                >
                  <span className="text-xl font-bold" style={{ color: DARK }}>✕</span>
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 pt-5 overflow-y-auto">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavigation(item.route, item.label)}
                    className="flex items-center w-full px-5 py-4 border-b border-gray-100 hover:bg-gray-50"
                  >
                    <span className="text-xl mr-4 w-6 text-center">{item.icon}</span>
                    <span className="text-base font-medium" style={{ color: DARK }}>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* User Info Section */}
              {currentUser && (
                <div className="p-5 border-t border-gray-200 bg-gray-50">
                  <div className="mb-4">
                    <p className="text-base font-bold mb-1" style={{ color: DARK }}>
                      {userData?.name || userData?.firstName || 'User'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {userData?.email || currentUser.email}
                    </p>
                  </div>
                  <button 
                    onClick={async () => {
                      setIsMenuOpen(false);
                      try {
                        await logout();
                        router.push('/');
                      } catch (error) {
                        console.error('Logout failed:', error);
                      }
                    }}
                    className="w-full bg-red-500 py-3 px-5 rounded-lg text-center"
                  >
                    <span className="text-white text-base font-semibold">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};
