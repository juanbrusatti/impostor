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

      // Prevent bounce effect on iOS
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.top = '0';
      document.body.style.left = '0';

      // Add to home screen prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        // You can show a custom "Add to Home Screen" button here
      });
    }

    const handleUserInteraction = () => {
      handleFullscreen();
      // For iOS, we need to scroll to top to hide the address bar
      if (isIOS()) {
        window.scrollTo(0, 1);
      }
    };

    // Add event listeners
    window.addEventListener('load', handleUserInteraction);
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);
    window.addEventListener('orientationchange', handleUserInteraction);

    // Initial call
    handleUserInteraction();

    // Cleanup
    return () => {
      window.removeEventListener('load', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('orientationchange', handleUserInteraction);
      
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

  return <div style={{ height: '100vh', width: '100vw', overflow: 'hidden' }}>{children}</div>;
}
