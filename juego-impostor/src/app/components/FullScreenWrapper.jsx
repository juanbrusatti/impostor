'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Detect if iOS
const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export default function FullScreenWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const handleFullscreen = () => {
      const element = document.documentElement;
      
      // Check if already in fullscreen
      const isInFullScreen = 
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      
      if (!isInFullScreen) {
        if (element.requestFullscreen) {
          element.requestFullscreen().catch(console.error);
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }
    };

    // For iOS, we need to handle fullscreen differently
    if (isIOS()) {
      // iOS specific fullscreen handling
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'apple-mobile-web-app-capable');
      meta.setAttribute('content', 'yes');
      document.head.appendChild(meta);

      // Better scroll handling for iOS
      document.body.style.overflow = 'auto';
      document.body.style.position = 'relative';
      document.body.style.width = '100%';
      document.body.style.height = 'auto';
      document.body.style.minHeight = '100vh';

      // Add to home screen prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        // You can show a custom "Add to Home Screen" button here
      });
    }

    let touchStartY = 0;
    let lastTap = 0;
    const TAP_DELAY = 300; // ms

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchDiff = Math.abs(touchEndY - touchStartY);
      const currentTime = new Date().getTime();
      
      // Only trigger fullscreen on small taps, not scrolls
      if (touchDiff < 10) {
        handleFullscreen();
      }
      
      // Handle double tap for iOS to show/hide UI
      if (touchDiff < 10 && currentTime - lastTap < TAP_DELAY) {
        e.preventDefault();
        if (isIOS() && window.scrollY === 0) {
          window.scrollTo(0, 1);
        }
      }
      lastTap = currentTime;
    };

    // Add event listeners
    window.addEventListener('load', handleFullscreen);
    window.addEventListener('click', handleFullscreen);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('orientationchange', handleFullscreen);

    // Initial call
    handleFullscreen();

    // Cleanup
    return () => {
      window.removeEventListener('load', handleFullscreen);
      window.removeEventListener('click', handleFullscreen);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('orientationchange', handleFullscreen);
      
      if (isIOS()) {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.top = '';
        document.body.style.left = '';
      }
    };
  }, [pathname]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      overflow: 'auto',
      WebkitOverflowScrolling: 'touch',
      position: 'relative'
    }}>
      {children}
    </div>
  );
}
