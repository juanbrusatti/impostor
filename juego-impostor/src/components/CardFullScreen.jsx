import React, { useRef, useState, useEffect } from "react";

/**
 * CardFullScreen - Drawer Style
 * Muestra una carta en pantalla completa con un cajón que se abre desde abajo.
 * Props:
 * - role: "IMPOSTOR" | "INOCENTE"
 * - playerName: nombre del futbolista
 * - playerRealName: nombre real del jugador
 * - onReveal: callback cuando se revela el contenido
 * - onNext: callback para pasar a la siguiente carta
 * - index: índice de la carta
 * - total: total de cartas
 * - onRestart: callback para reiniciar el juego
 * - showVoteButton: booleano que indica si se debe mostrar el botón de votar
 * - onVote: callback para votar
 */
export default function CardFullScreen({
  role,
  playerName,
  playerRealName,
  onReveal,
  onNext,
  index,
  total,
  onRestart,
  showVoteButton,
  onVote,
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerHeight, setDrawerHeight] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentDragY, setCurrentDragY] = useState(0);
  const [hasRevealed, setHasRevealed] = useState(false);
  
  const drawerRef = useRef(null);
  const containerRef = useRef(null);

  // Configuración del drawer
  const DRAWER_MAX_HEIGHT = window.innerHeight * 0.7; // 70% de la pantalla
  const DRAWER_MIN_HEIGHT = 0;
  const REVEAL_THRESHOLD = DRAWER_MAX_HEIGHT * 0.5; // 50% para revelar

  // Detectar si es móvil
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
           window.innerWidth <= 768;
  };

  // Touch events para móvil
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStartY(e.touches[0].clientY);
      setCurrentDragY(drawerHeight);
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      const deltaY = dragStartY - e.touches[0].clientY;
      const newHeight = Math.max(DRAWER_MIN_HEIGHT, 
                                Math.min(DRAWER_MAX_HEIGHT, currentDragY + deltaY));
      setDrawerHeight(newHeight);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging) {
      setIsDragging(false);
      
      // Determinar si abrir o cerrar
      if (drawerHeight > REVEAL_THRESHOLD) {
        // Abrir completamente
        setDrawerHeight(DRAWER_MAX_HEIGHT);
        setDrawerOpen(true);
        if (!hasRevealed) {
          setHasRevealed(true);
          if (onReveal) {
            setTimeout(() => onReveal(index), 300);
          }
        }
      } else {
        // Cerrar completamente
        setDrawerHeight(DRAWER_MIN_HEIGHT);
        setDrawerOpen(false);
      }
    }
  };

  // Mouse events para desktop
  const handleMouseDown = (e) => {
    if (e.button === 0) { // Click izquierdo
      setIsDragging(true);
      setDragStartY(e.clientY);
      setCurrentDragY(drawerHeight);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const deltaY = dragStartY - e.clientY;
      const newHeight = Math.max(DRAWER_MIN_HEIGHT, 
                                Math.min(DRAWER_MAX_HEIGHT, currentDragY + deltaY));
      setDrawerHeight(newHeight);
    }
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      
      if (drawerHeight > REVEAL_THRESHOLD) {
        setDrawerHeight(DRAWER_MAX_HEIGHT);
        setDrawerOpen(true);
        if (!hasRevealed) {
          setHasRevealed(true);
          if (onReveal) {
            setTimeout(() => onReveal(index), 300);
          }
        }
      } else {
        setDrawerHeight(DRAWER_MIN_HEIGHT);
        setDrawerOpen(false);
      }
    }
  };

  // Click para abrir/cerrar en desktop
  const handleContainerClick = (e) => {
    if (!isMobile() && !isDragging) {
      if (drawerOpen) {
        setDrawerHeight(DRAWER_MIN_HEIGHT);
        setDrawerOpen(false);
      } else {
        setDrawerHeight(DRAWER_MAX_HEIGHT);
        setDrawerOpen(true);
        if (!hasRevealed) {
          setHasRevealed(true);
          if (onReveal) {
            setTimeout(() => onReveal(index), 300);
          }
        }
      }
    }
  };

  // Wheel para desktop
  const handleWheel = (e) => {
    if (!isMobile()) {
      e.preventDefault();
      const delta = e.deltaY * 0.5;
      const newHeight = Math.max(DRAWER_MIN_HEIGHT, 
                                Math.min(DRAWER_MAX_HEIGHT, drawerHeight + delta));
      setDrawerHeight(newHeight);
      
      if (newHeight > REVEAL_THRESHOLD && !drawerOpen) {
        setDrawerOpen(true);
        if (!hasRevealed) {
          setHasRevealed(true);
          if (onReveal) {
            setTimeout(() => onReveal(index), 300);
          }
        }
      } else if (newHeight <= REVEAL_THRESHOLD && drawerOpen) {
        setDrawerOpen(false);
      }
    }
  };

  // Prevenir scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-br from-[#1e1e2f] to-[#4cafef] text-white overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleContainerClick}
      onWheel={handleWheel}
      style={{ touchAction: 'none', userSelect: 'none' }}
    >
      {/* Header con información del jugador */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {/* Indicador de swipe */}
        {!drawerOpen && (
          <div className="absolute top-8 left-0 right-0 flex flex-col items-center">
            <div className="w-12 h-1 rounded-full bg-white/40 mb-2" />
            <span className="text-base text-white/70 animate-bounce">
              {isMobile() ? "Desliza hacia arriba para revelar" : "Haz click o usa la rueda del mouse"}
            </span>
          </div>
        )}

        {/* Contenido principal de la carta */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-bold mb-4">
            {playerRealName || `Jugador ${index + 1}`}
          </div>
          <div className="text-xl text-white/70">
            {drawerOpen ? "Tu rol está revelado" : "Desliza hacia arriba para ver tu rol"}
          </div>
        </div>
      </div>

      {/* Drawer que se abre desde abajo */}
      <div
        ref={drawerRef}
        className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-t-3xl shadow-2xl transition-all duration-300 ease-out"
        style={{
          height: `${drawerHeight}px`,
          transform: `translateY(${drawerHeight > 0 ? 0 : '100%'})`,
        }}
      >
        {/* Handle del drawer */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 rounded-full bg-gray-400" />
        </div>

        {/* Contenido del drawer */}
        <div className="flex flex-col items-center justify-center p-8 h-full">
          {drawerOpen ? (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-2xl text-gray-600 mb-4">
                {playerRealName || "Jugador"}
              </div>
              <div className="w-full h-px bg-gray-300 my-4"></div>
              
              {role === "IMPOSTOR" ? (
                <div className="text-6xl font-extrabold text-red-500 flex items-center gap-4 mb-6">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 0v6m0 0h3m-3 0H9" />
                  </svg>
                  IMPOSTOR
                </div>
              ) : (
                <div className="text-5xl font-bold text-green-500 flex items-center gap-4 mb-6">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {playerName || "INOCENTE"}
                </div>
              )}

              {/* Botones de navegación */}
              <div className="flex flex-col items-center gap-4 mt-8">
                {index + 1 < total ? (
                  <button
                    className="bg-[#4cafef] hover:bg-[#3196e8] px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                    onClick={onNext}
                  >
                    Siguiente carta
                  </button>
                ) : (
                  <>
                    {showVoteButton && (
                      <button
                        className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                        onClick={onVote}
                      >
                        Votar
                      </button>
                    )}
                    <button
                      className="bg-[#4cafef] hover:bg-[#3196e8] px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                      onClick={onRestart}
                    >
                      Volver a jugar
                    </button>
                    <button
                      className="bg-gray-500 hover:bg-gray-700 px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all"
                      onClick={onNext}
                    >
                      Terminar
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-gray-700 mb-4">
                {playerRealName || `Jugador ${index + 1}`}
              </div>
              <div className="text-lg text-gray-500">
                Desliza hacia arriba para revelar tu rol
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}