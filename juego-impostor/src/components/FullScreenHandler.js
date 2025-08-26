import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function FullScreenHandler() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Verificar si estamos en un navegador
    if (typeof window === 'undefined') return;

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || 
                    document.webkitIsFullScreen || 
                    document.mozFullScreen || 
                    document.msFullscreenElement);
    };

    // Escuchar cambios en el estado de pantalla completa
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Intentar entrar en pantalla completa al cargar
    const enterFullscreen = () => {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        element.requestFullscreen().catch(err => {
          console.log('Error al intentar pantalla completa:', err);
        });
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    };

    // Solo intentar pantalla completa después de una interacción del usuario
    const handleUserInteraction = () => {
      enterFullscreen();
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };

    // Agregar listeners para la primera interacción
    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('touchstart', handleUserInteraction);

    // Limpieza
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  return (
    <Head>
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Impostor" />
      
      {/* Estilos para ocultar la barra de direcciones en móviles */}
      <style jsx global>{`
        html, body {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior-y: none;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        /* Ocultar la barra de direcciones en móviles */
        @media (display-mode: standalone) {
          body {
            -webkit-tap-highlight-color: transparent;
          }
        }
        
        /* Estilos para el botón de pantalla completa */
        .fullscreen-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          font-size: 24px;
          cursor: pointer;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        
        .fullscreen-button:focus {
          outline: none;
        }
      `}</style>
    </Head>
  );
}
