import React, { useRef, useState } from "react";

/**
 * CardFullScreen
 * Muestra una carta en pantalla completa y permite revelar el contenido con swipe hacia arriba.
 * Props:
 * - role: "IMPOSTOR" | "INOCENTE"
 * - playerName: nombre del futbolista
 * - playerRealName: nombre real del jugador
 * - onReveal: callback cuando se revela el contenido
 * - onNext: callback para pasar a la siguiente carta
 * - index: índice de la carta
 * - total: total de cartas
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
}) {
  const [revealed, setRevealed] = useState(false);
  const [dragY, setDragY] = useState(0); // Para feedback visual
  const dragStartY = useRef(null);
  const dragging = useRef(false);

  // --- Touch events (mobile) ---
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      dragging.current = true;
      dragStartY.current = e.touches[0].clientY;
      setDragY(0);
    }
  };
  const handleTouchMove = (e) => {
    if (dragging.current && e.touches.length === 1) {
      const deltaY = dragStartY.current - e.touches[0].clientY;
      setDragY(Math.max(0, deltaY));
    }
  };
  const handleTouchEnd = () => {
    if (dragging.current) {
      const threshold = window.innerHeight * 0.33;
      if (dragY > threshold && !revealed) {
        setRevealed(true);
        // Solo llamar onReveal si revealed era false justo antes
        if (onReveal) {
          setTimeout(() => onReveal(index), 0);
        }
      }
      setDragY(0);
      dragging.current = false;
    }
  };

  // --- Mouse events (PC) ---
  // Click derecho (button === 2)
  const handleMouseDown = (e) => {
    if (e.button === 2) { // click derecho
      dragging.current = true;
      dragStartY.current = e.clientY;
      setDragY(0);
    }
  };
  const handleMouseMove = (e) => {
    if (dragging.current) {
      const deltaY = dragStartY.current - e.clientY;
      setDragY(Math.max(0, deltaY));
    }
  };
  const handleMouseUp = (e) => {
    if (dragging.current) {
      const threshold = window.innerHeight * 0.33;
      if (dragY > threshold && !revealed) {
        setRevealed(true);
        if (onReveal) {
          setTimeout(() => onReveal(index), 0);
        }
      }
      setDragY(0);
      dragging.current = false;
    }
  };
  // Scroll con rueda del mouse hacia abajo
const handleWheel = (e) => {
  if (!revealed && e.deltaY > 0) { // solo hacia abajo
    setDragY((prev) => {
      const newDragY = prev + e.deltaY; // ya es positivo
      if (newDragY > window.innerHeight * 0.33 && !revealed) {
        setRevealed(true);
        if (onReveal) {
          setTimeout(() => onReveal(index), 0);
        }
        return 0;
      }
      return newDragY;
    });
  }
};


  // Para evitar scroll de fondo en mobile
  React.useEffect(() => {
    if (!revealed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [revealed]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-[#1e1e2f] to-[#4cafef] text-white"
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  onMouseDown={handleMouseDown}
  onMouseMove={dragging.current ? handleMouseMove : undefined}
  onMouseUp={handleMouseUp}
  onMouseLeave={handleMouseUp}
  onWheel={handleWheel}
  onContextMenu={(e) => e.preventDefault()} // evitar menú contextual
  style={{ touchAction: 'none', userSelect: 'none' }}
    >
      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {/* Indicador swipe */}
        {!revealed && (
          <div className="absolute top-8 left-0 right-0 flex flex-col items-center">
            <div className="w-12 h-1 rounded-full bg-white/40 mb-2" />
            <span className="text-base text-white/70 animate-bounce">Desliza hacia arriba para revelar</span>
          </div>
        )}
        {/* Contenido de la carta */}
        <div
          className={`w-full max-w-sm mx-auto rounded-2xl shadow-2xl bg-white/10 p-12 flex flex-col items-center justify-center transition-all duration-500 ${
            revealed ? "scale-105" : "scale-100"
          }`}
          style={!revealed && dragY > 0 ? {
            transform: `translateY(-${dragY}px) scale(${1 + dragY/600})`,
            boxShadow: dragY > 40 ? '0 8px 32px #4cafef88' : undefined
          } : undefined}
        >
          {!revealed ? (
            <div className="flex flex-col items-center justify-center h-80">
              <span className="text-3xl font-bold mb-2">{playerRealName || `Jugador ${index + 1}`}</span>
              <span className="text-lg text-white/70">Desliza para ver tu rol</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80">
              <span className="text-xl text-gray-300 mb-2">{playerRealName || "Jugador"}</span>
              <div className="w-full h-px bg-white/20 my-2"></div>
              {role === "IMPOSTOR" ? (
                <span className="text-4xl font-extrabold text-red-500 flex items-center gap-2">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 0v6m0 0h3m-3 0H9" /></svg>
                  IMPOSTOR
                </span>
              ) : (
                <span className="text-3xl font-bold text-green-400 flex items-center gap-2">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {playerName || "INOCENTE"}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Navegación */}
      {revealed && (
  <div className="w-full flex flex-col items-center mt-8">
    {index + 1 < total ? (
      <button
        className="bg-[#4cafef] hover:bg-[#3196e8] px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all mb-4"
        onClick={onNext}
      >
        Siguiente carta
      </button>
    ) : (
      <>
        {/* Botón de votar, solo visible si showVoteButton es true */}
        {showVoteButton && (
          <button
            className="bg-red-500 hover:bg-yellow-600 w-70 max-w-xs py-2 rounded-lg font-bold text-base shadow-lg transition-all mb-3"
            onClick={() => alert('Votación iniciada (lógica pendiente)')}
          >
            Votar
          </button>
        )}
          <button
          className="bg-[#4cafef] hover:bg-[#3196e8] w-60 max-w-xs py-2 rounded-lg font-semibold text-sm shadow-md transition-all mb-3"
          onClick={onRestart}
          >
          Volver a jugar
          </button>
          <button
          className="bg-gray-500 hover:bg-gray-700 w-50 max-w-xs py-2 rounded-md font-normal text-sm shadow transition-all mb-8"
          onClick={onNext}
          >
          Terminar
         </button>
      </>
    )}
  </div>
)}
    </div>
  );
};