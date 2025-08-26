'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FullScreenWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement || 
                         document.webkitIsFullScreen || 
                         document.mozFullScreen || 
                         document.msFullscreenElement;
      
      if (!isFullscreen) {
        const element = document.documentElement;
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

    // Try to enter fullscreen on user interaction
    const handleUserInteraction = () => {
      handleFullscreenChange();
      // Remove the event listeners after first interaction
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    // Add event listeners for user interaction
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    // Cleanup
    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [pathname]);

  return <>{children}</>;
}
